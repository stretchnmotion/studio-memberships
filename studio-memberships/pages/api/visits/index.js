// pages/api/visits/index.js
// Log walk-in visits and retrieve visit history
// GET  /api/visits?memberId=xxx   — get visits for a member
// GET  /api/visits?today=true     — get all visits today
// POST /api/visits                — log a new visit

import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('studio-memberships');
  const visits = db.collection('visits');

  if (req.method === 'GET') {
    try {
      const { memberId, today } = req.query;
      let query = {};

      if (memberId) {
        query.memberId = memberId;
      } else if (today === 'true') {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        query.visitDate = { $gte: start, $lte: end };
      }

      const result = await visits.find(query).sort({ visitDate: -1 }).limit(100).toArray();
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const {
        memberId,
        memberName,
        service,
        rateCharged,
        rateType,  // 'walkin' | 'member' | 'og' | 'comp'
        therapist,
        notes,
      } = req.body;

      const visit = {
        memberId: memberId || null,
        memberName: memberName || 'Unknown',
        service: service || '25-min Stretch Session',
        rateCharged: parseFloat(rateCharged) || 0,
        rateType: rateType || 'walkin',
        therapist: therapist || '',
        notes: notes || '',
        visitDate: new Date(),
      };

      const result = await visits.insertOne(visit);

      // Update member's visit count and last visit date if tied to a member
      if (memberId && ObjectId.isValid(memberId)) {
        await db.collection('members').updateOne(
          { _id: new ObjectId(memberId) },
          {
            $inc: { totalVisits: 1 },
            $set: { lastVisitDate: new Date(), daysSinceLastAppt: 0 },
          }
        );
      }

      return res.status(201).json({ ...visit, _id: result.insertedId });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
