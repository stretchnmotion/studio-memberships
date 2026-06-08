// pages/api/cleanup/orphans.js
// Compares studio-memberships records against Acuity clients
// Returns records in studio-memberships that have no match in Acuity
// Acuity is READ-ONLY — this route never writes to Acuity
//
// GET  /api/cleanup/orphans        — fetch comparison results
// POST /api/cleanup/orphans        — bulk delete selected IDs from studio-memberships only

import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

const ACUITY_PROXY = 'https://snm-booking-api.vercel.app/api/acuity';
const ACUITY_USER_ID = process.env.ACUITY_USER_ID || '28710683';
const ACUITY_API_KEY = process.env.ACUITY_API_KEY || '4a87169ba6a112446d5ca63716d165c3';

async function fetchAcuityClients() {
  const token = Buffer.from(`${ACUITY_USER_ID}:${ACUITY_API_KEY}`).toString('base64');
  
  // Try proxy first, fall back to direct
  try {
    const res = await fetch(`${ACUITY_PROXY}/clients`, {
      headers: { Authorization: `Basic ${token}` },
    });
    if (res.ok) return res.json();
  } catch {}

  // Direct fallback
  const res = await fetch('https://acuityscheduling.com/api/v1/clients', {
    headers: { Authorization: `Basic ${token}` },
  });
  if (!res.ok) throw new Error(`Acuity error ${res.status}`);
  return res.json();
}

function normalize(str) {
  return (str || '').toLowerCase().trim().replace(/\s+/g, ' ');
}

function matchScore(studioMember, acuityClient) {
  let score = 0;

  // Email match — strongest signal
  const studioEmail = normalize(studioMember.email);
  const acuityEmail = normalize(acuityClient.email);
  if (studioEmail && acuityEmail && studioEmail === acuityEmail) score += 100;

  // Phone match
  const studioPhone = (studioMember.phone || '').replace(/\D/g, '');
  const acuityPhone = (acuityClient.phone || '').replace(/\D/g, '');
  if (studioPhone.length >= 10 && studioPhone === acuityPhone) score += 80;

  // Full name match
  const studioName = normalize(`${studioMember.firstName} ${studioMember.lastName}`);
  const acuityName = normalize(`${acuityClient.firstName} ${acuityClient.lastName}`);
  if (studioName && acuityName && studioName === acuityName) score += 60;

  // Partial name match
  if (studioName && acuityName) {
    const studioParts = studioName.split(' ');
    const acuityParts = acuityName.split(' ');
    const overlap = studioParts.filter(p => p.length > 1 && acuityParts.includes(p));
    score += overlap.length * 15;
  }

  return score;
}

export default async function handler(req, res) {
  // ── GET — find clean record candidates ───────────────────────────────────
  if (req.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db('studio-memberships');
      const members = db.collection('members');

      // Fetch both lists in parallel
      const [studioMembers, acuityClients] = await Promise.all([
        members.find({}).toArray(),
        fetchAcuityClients(),
      ]);

      const results = [];

      for (const sm of studioMembers) {
        // Find best Acuity match
        let bestScore = 0;
        let bestMatch = null;

        for (const ac of acuityClients) {
          const score = matchScore(sm, ac);
          if (score > bestScore) {
            bestScore = score;
            bestMatch = ac;
          }
        }

        const isOrphan = bestScore < 60; // below threshold = no reliable match

        results.push({
          _id: String(sm._id),
          firstName: sm.firstName,
          lastName: sm.lastName,
          email: sm.email,
          phone: sm.phone,
          status: sm.status,
          pkg: sm.pkg,
          daysSinceLastAppt: sm.daysSinceLastAppt,
          matchScore: bestScore,
          isOrphan,
          bestAcuityMatch: bestMatch ? {
            firstName: bestMatch.firstName,
            lastName: bestMatch.lastName,
            email: bestMatch.email,
            phone: bestMatch.phone,
          } : null,
        });
      }

      // Sort: orphans first, then by match score ascending
      results.sort((a, b) => {
        if (a.isOrphan !== b.isOrphan) return a.isOrphan ? -1 : 1;
        return a.matchScore - b.matchScore;
      });

      return res.status(200).json({
        total: studioMembers.length,
        acuityTotal: acuityClients.length,
        orphanCount: results.filter(r => r.isOrphan).length,
        results,
      });
    } catch (err) {
      console.error('Cleanup orphan check error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  // ── POST — bulk delete selected IDs from studio-memberships only ──────────
  if (req.method === 'POST') {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: 'No IDs provided' });
      }

      const client = await clientPromise;
      const db = client.db('studio-memberships');

      const objectIds = ids
        .filter(id => ObjectId.isValid(id))
        .map(id => new ObjectId(id));

      const result = await db.collection('members').deleteMany({
        _id: { $in: objectIds },
      });

      // Also clean up any flags for deleted members
      await db.collection('flags').deleteMany({
        memberId: { $in: ids },
      });

      return res.status(200).json({
        success: true,
        deleted: result.deletedCount,
        requested: ids.length,
      });
    } catch (err) {
      console.error('Bulk delete error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
