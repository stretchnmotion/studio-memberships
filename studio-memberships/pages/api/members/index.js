import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('studio-memberships');
  const col = db.collection('members');

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
    let updatedCount = 0;
    for (const id of ids) {
      try {
        const result = await col.updateOne(
          { _id: new ObjectId(String(id)) },
          { $set: updates }
        );
        updatedCount += result.modifiedCount;
      } catch (e) {}
    }
    return res.status(200).json({ ok: true, updated: updatedCount });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    await col.deleteOne({ _id: new ObjectId(String(id)) });
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
