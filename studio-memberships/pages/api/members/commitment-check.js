// pages/api/members/commitment-check.js
// Scans members whose 2-month commitment is ending within 7 days
// Creates a 'commitment' flag for any not yet flagged
// POST /api/members/commitment-check  — run the check
// GET  /api/members/commitment-check  — list members in active commitment window

import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('studio-memberships');
  const members = db.collection('members');
  const flags = db.collection('flags');

  // ── GET — list all members currently in their commitment window ───────────
  if (req.method === 'GET') {
    try {
      const now = new Date();
      const allMembers = await members.find({
        commitmentStart: { $exists: true, $ne: null },
        status: 'active',
      }).toArray();

      const result = allMembers.map(m => {
        const start = new Date(m.commitmentStart);
        const end = new Date(start);
        end.setMonth(end.getMonth() + 2);
        const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
        const daysIn = Math.floor((now - start) / (1000 * 60 * 60 * 24));
        return {
          ...m,
          commitmentEnd: end.toISOString(),
          daysLeft,
          daysIn,
          isEnding: daysLeft <= 7,
          isOverdue: daysLeft < 0,
        };
      });

      // Sort by days left ascending
      result.sort((a, b) => a.daysLeft - b.daysLeft);

      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ── POST — run commitment check and create flags ──────────────────────────
  if (req.method === 'POST') {
    try {
      const now = new Date();
      const in7Days = new Date(now);
      in7Days.setDate(in7Days.getDate() + 7);

      // Find active members with commitments ending within 7 days
      const endingMembers = await members.find({
        commitmentStart: { $exists: true, $ne: null },
        status: 'active',
        commitmentFlagSent: { $ne: true },
      }).toArray();

      let flagsCreated = 0;

      for (const m of endingMembers) {
        const end = new Date(m.commitmentStart);
        end.setMonth(end.getMonth() + 2);
        const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));

        if (daysLeft <= 7) {
          // Create commitment flag
          await flags.insertOne({
            memberId: String(m._id),
            reason: 'commitment',
            note: daysLeft <= 0
              ? `2-month commitment ended ${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? 's' : ''} ago — confirm continuation or cancel billing`
              : `2-month commitment ends in ${daysLeft} day${daysLeft !== 1 ? 's' : ''} — confirm continuation or cancel billing`,
            date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            resolved: false,
            createdAt: now,
          });

          // Mark so we don't double-flag
          await members.updateOne(
            { _id: m._id },
            { $set: { commitmentFlagSent: true } }
          );

          flagsCreated++;
        }
      }

      return res.status(200).json({ success: true, flagsCreated, checked: endingMembers.length });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
