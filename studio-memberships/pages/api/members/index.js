import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

const PRODUCT_IDS = [
  { id: 1497341, pkg: '4x/month' },
  { id: 1497732, pkg: '8x/month' },
  { id: 1521706, pkg: '4x/month — First Responder' },
  { id: 1521713, pkg: '8x/month — First Responder' },
  { id: 1497733, pkg: '16x/month' },
];

function normalizeName(str) {
  return (str || '').toLowerCase().trim().replace(/\s+/g, ' ');
}

async function fetchActiveSubscribers() {
  const auth = Buffer.from(`${process.env.ACUITY_USER_ID}:${process.env.ACUITY_API_KEY}`).toString('base64');
  const headers = { Authorization: `Basic ${auth}` };
  const allSubscribers = [];

  for (const product of PRODUCT_IDS) {
    try {
      const r = await fetch(`https://acuityscheduling.com/api/v1/products/subscriptions?productID=${product.id}`, { headers });
      if (r.ok) {
        const subs = await r.json();
        if (Array.isArray(subs)) {
          subs
            .filter(s =>
              s.status === 'active' &&
              s.firstName && s.firstName.trim() !== '-' && s.firstName.trim() !== '' &&
              s.lastName && s.lastName.trim() !== '-' && s.lastName.trim() !== ''
            )
            .forEach(s => allSubscribers.push({ ...s, pkg: product.pkg }));
        }
      }
    } catch (e) {
      console.error(`Product ${product.id} failed:`, e.message);
    }
  }

  return allSubscribers;
}

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('studio-memberships');
  const col = db.collection('members');

  if (req.query.sync) {
    try {
      const [subscribers, dbMembers] = await Promise.all([
        fetchActiveSubscribers(),
        col.find({}).toArray(),
      ]);

      const dbByName = {};
      dbMembers.forEach(m => {
        dbByName[normalizeName(`${m.firstName} ${m.lastName}`)] = m;
      });

      const newMembers = [];
      const alreadyInDB = [];
      const seen = new Set();

      for (const s of subscribers) {
        const key = normalizeName(`${s.firstName} ${s.lastName}`);
        if (seen.has(key)) continue;
        seen.add(key);

        if (dbByName[key]) {
          alreadyInDB.push({ firstName: s.firstName, lastName: s.lastName, pkg: s.pkg });
        } else {
          newMembers.push({
            firstName: s.firstName,
            lastName: s.lastName,
            email: s.email || '',
            phone: s.phone || '',
            pkg: s.pkg,
            status: 'active',
            source: 'acuity-sync',
            createdAt: new Date(),
          });
        }
      }

      const subscriberNames = new Set(Array.from(seen));
      const notInAcuity = dbMembers
        .filter(m => m.status === 'active' && !subscriberNames.has(normalizeName(`${m.firstName} ${m.lastName}`)))
        .map(m => ({ _id: String(m._id), firstName: m.firstName, lastName: m.lastName, pkg: m.pkg }));

      if (req.query.sync === 'preview') {
        return res.status(200).json({
          newMembers,
          alreadyInDB: alreadyInDB.length,
          notInAcuity,
          acuityTotal: subscribers.length,
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
