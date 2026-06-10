import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { ids, updates } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'No IDs provided' });
    }

    const client = await clientPromise;
    const db = client.db('studio-memberships');

    const objectIds = ids
      .filter(id => ObjectId.isValid(id))
      .map(id => new ObjectId(id));

    const result = await db.collection('members').updateMany(
      { _id: { $in: objectIds } },
      { $set: { ...updates, updatedAt: new Date() } }
    );

    return res.status(200).json({
      success: true,
      updated: result.modifiedCount,
      requested: ids.length,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
