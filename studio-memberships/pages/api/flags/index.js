// pages/api/flags/index.js
// PROTECTED: hardcoded to 'flags' collection — never touches 'members'
// DELETE requires explicit ?id= param — no bulk delete possible

import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

const COLLECTION = 'flags'; // hardcoded — do not change

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('studio-memberships');

  // Safety check — if collection ever gets changed, blow up loudly
  if (COLLECTION !== 'flags') {
    console.error('CRITICAL: flags API pointed at wrong collection!');
    return res.status(500).json({ error: 'Collection misconfiguration' });
  }

  const col = db.collection(COLLECTION);

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
    if (!_id) return res.status(400).json({ error: 'Missing _id' });
    await col.updateOne({ _id: new ObjectId(String(_id)) }, { $set: update });
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;

    // GUARD: require explicit id — never allow bulk delete
    if (!id) {
      return res.status(400).json({ error: 'DELETE requires explicit ?id= param. Bulk delete is not allowed.' });
    }

    // GUARD: validate it's a real ObjectId before touching DB
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    await col.deleteOne({ _id: new ObjectId(String(id)) });
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
