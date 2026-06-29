// pages/api/revenue/index.js
// Tracks monthly revenue snapshots for historical comparison
// GET  /api/revenue                — list all monthly snapshots, sorted newest first
// POST /api/revenue                — save/update current month's snapshot
//
// A snapshot is taken whenever the dashboard loads, keyed by YYYY-MM.
// This lets us show "this month vs last month" % change without
// needing to backfill historical data we never tracked.

import clientPromise from '../../../lib/mongodb';

function monthKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('studio-memberships');
  const col = db.collection('revenue_snapshots');

  if (req.method === 'GET') {
    try {
      const snapshots = await col.find({}).sort({ monthKey: -1 }).limit(24).toArray();
      return res.status(200).json(snapshots);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { membershipRevenue, walkInRevenue, activeMembers, totalRevenue } = req.body;
      const now = new Date();
      const key = monthKey(now);

      await col.updateOne(
        { monthKey: key },
        {
          $set: {
            monthKey: key,
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            membershipRevenue: membershipRevenue || 0,
            walkInRevenue: walkInRevenue || 0,
            totalRevenue: totalRevenue || 0,
            activeMembers: activeMembers || 0,
            updatedAt: now,
          },
        },
        { upsert: true }
      );

      return res.status(200).json({ ok: true, monthKey: key });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
