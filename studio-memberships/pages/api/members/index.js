import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

const ACUITY_PROXY = 'https://snm-booking-api.vercel.app/api/acuity';

const PACKAGE_MAP = {
  '4 sessions a month maintenance': '4x/month',
  '4 sessions a month': '4x/month',
  '8 times a month flexibility makeover (stretch or massage)': '8x/month',
  '8 times a month flexibility makeover': '8x/month',
  '1st responder 4 pack': '4x/month — First Responder',
  '1st responder 8 pack': '8x/month — First Responder',
  '16 sessions a month': '16x/month',
};

function normalizePkg(name) {
  if (!name) return null;
  return PACKAGE_MAP[name.toLowerCase().trim()] || name;
}

function normalizeName(str) {
  return (str || '').toLowerCase().trim().replace(/\s+/g, ' ');
}

async function fetchAcuityClients() {
  const auth = Buffer.from(`${process.env.ACUITY_USER_ID}:${process.env.ACUITY_API_KEY}`).toString('base64');
  try {
    const res = await fetch(`${ACUITY_PROXY}/clients`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    if (res.ok) return res.json();
  } catch {}
  const res = await fetch('https://acuityscheduling.com/api/v1/clients', {
    headers: { Authorization: `Basic ${auth}` },
  });
  if (!res.ok) throw new Error(`Acuity error ${res.status}`);
  return res.json();
}

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('studio-memberships');
  const col = db.collection('members');

  // Acuity sync
  if (req.query.sync) {
    try {
      const [acuityClients, dbMembers] = await Promise.all([
        fetchAcuityClients(),
        col.find({}).toArray(),
      ]);

      const clients = Array.isArray(acuityClients) ? acuityClients : [];

      const dbByName = {};
      dbMembers.forEach(m => {
        dbByName[normalizeName(`${m.firstName} ${m.lastName}`)] = m;
      });

      const newMembers = [];
      const alreadyInDB = [];

      for (const c of clients) {
        const key = normalizeName(`${c.firstName} ${c.lastName}`);
        if (dbByName[key]) {
          alreadyInDB.push({ firstName: c.firstName, lastName: c.lastName });
        } else {
          newMembers.push({
            firstName: c.firstName,
            lastName: c.lastName,
            email: c.email || '',
            phone: c.phone || '',
            pkg: '',
            status: 'active',
            source: 'acuity-sync',
            createdAt: new Date(),
          });
        }
      }

      const acuityNames = new Set(clients.map(c => normalizeName(`${c.firstName} ${c.lastName}`)));
      const notInAcuity = dbMembers
        .filter(m => m.status === 'active' && !acuityNames.has(normalizeName(`${m.firstName} ${m.lastName}`)))
        .map(m => ({ _id: String(m._id), firstName: m.firstName, lastName: m.lastName, pkg: m.pkg }));

      if (req.query.sync === 'preview') {
        return res.status(200).json({
          newMembers,
          alreadyInDB: alreadyInDB.length,
          notInAcuity,
          acuityTotal: clients.length,
          dbTotal: dbMembers.length,
        });
      }

      if (req.query.sync === 'confirm' && req.method === 'POST') {
        let added = 0;
        for (const m of newMembers) { await col.insertOne(m); added++; }
        return res.status(200).json({ added, skipped: alreadyInDB.length });
      }

      return res.status(400).json({ error: 'Use ?sync=preview (GET) or ?sync=confirm (POST)' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'GET') {
    const members = await col.find({}).sort({ lastName: 1 }).toArray();
    return res.status(200).json(members);
  }

  if (req.method === 'POST') {
    const doc = { ...req.body, createdAt: new Date() };
    const result = await col.insertOne(doc);
    return res.status(201).json({ ...doc, _id: result.insertedId });
  }

  if (req.method === 'PUT') {
    const { _id, ...update } = req.body;
    await col.updateOne({ _id: new ObjectId(String(_id)) }, { $set: update });
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'PATCH') {
    const { ids, updates } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: 'No IDs' });
    const objectIds = ids.filter(id => ObjectId.isValid(id)).map(id => new ObjectId(id));
    const result = await col.updateMany({ _id: { $in: objectIds } }, { $set: updates });
    return res.status(200).json({ ok: true, updated: result.modifiedCount });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Missing id' });
    await col.deleteOne({ _id: new ObjectId(String(id)) });
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
