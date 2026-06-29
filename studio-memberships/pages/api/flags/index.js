import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('studio-memberships');
  const col = db.collection('flags');

  if (req.method === 'GET') {
    const flags = await col.find({}).sort({ createdAt: -1 }).toArray();
    return res.status(200).json(flags);
  }

  if (req.method === 'POST') {
    const doc = {
      memberId: req.body.memberId,
      reason: req.body.reason || 'manual',
      note: req.body.note || '',
      date: req.body.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      resolved: false,
      createdAt: new Date(),
    };
    const result = await col.insertOne(doc);
    return res.status(201).json({ ...doc, _id: result.insertedId });
  }

  if (req.method === 'PUT') {
    const { _id, ...update } = req.body;
    await col.updateOne({ _id: new ObjectId(String(_id)) }, { $set: update });
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    await col.deleteOne({ _id: new ObjectId(String(id)) });
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
