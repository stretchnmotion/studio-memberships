import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

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

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('studio-memberships');
  const col = db.collection('members');

  // Acuity sync — GET /api/members?sync=preview, POST /api/members?sync=confirm
  if (req.query.sync) {
    try {
      const auth = Buffer.from(`${process.env.ACUITY_USER_ID}:${process.env.ACUITY_API_KEY}`).toString('base64');
      const acuityRes = await fetch('https://acuityscheduling.com/api/v1/products/subscriptions?direction=ASC&max=1000', {
        headers: { 'Authorization': `Basic ${auth}` },
      });

      if (!acuityRes.ok) {
        const text = await acuityRes.text();
        return res.status(500).json({ error: `Acuity error ${acuityRes.status}: ${text}` });
      }

      const subscribers = await acuityRes.json();
      const active = Array.isArray(subscribers) ? subscribers.filter(s => !s.status || s.status === 'active') : [];
      const dbMembers = await col.find({}).toArray();

      const dbByName = {};
      dbMembers.forEach(m => {
        const key = normalizeName(`${m.firstName} ${m.lastName}`);
        dbByName[key] = m;
      });

      const newMembers = [];
      const alreadyInDB = [];

      for (const sub of active) {
        const key = normalizeName(`${sub.firstName} ${sub.lastName}`);
        const pkg = normalizePkg(sub.productName || sub.name || '');
        if (dbByName[key]) {
          alreadyInDB.push({ firstName: sub.firstName, lastName: sub.lastName, pkg });
        } else {
          newMembers.push({
            firstName: sub.firstName,
            lastName: sub.lastName,
            email: sub.email || '',
            phone: sub.phone || '',
            pkg,
            status: 'active',
            source: 'acuity-sync',
            createdAt: new Date(),
          });
        }
      }

      const acuityNames = new Set(active.map(s => normalizeName(`${s.firstName} ${s.lastName}`)));
      const notInAcuity = dbMembers
        .filter(m => m.status === 'active' && !acuityNames.has(normalizeName(`${m.firstName} ${m.lastName}`)))
        .map(m => ({ _id: String(m._id), firstName: m.firstName, lastName: m.lastName, pkg: m.pkg }));

      if (req.query.sync === 'preview') {
        return res.status(200).json({ newMembers, alreadyInDB: alreadyInDB.length, notInAcuity, acuityTotal: active.length, dbTotal: dbMembers.length });
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
