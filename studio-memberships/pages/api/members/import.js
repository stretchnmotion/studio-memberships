// pages/api/members/import.js
// Handles CSV import from Acuity client export
// Columns: First Name, Last Name, Phone, Email, Notes, Days Since Last Appointment, Banned

import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { members: rows } = req.body;
    if (!Array.isArray(rows)) return res.status(400).json({ error: 'Invalid data' });

    const client = await clientPromise;
    const db = client.db('studio-memberships');
    const col = db.collection('members');

    let inserted = 0;
    let skipped = 0;
    let updated = 0;

    for (const row of rows) {
      const firstName = (row['First Name'] || '').trim();
      const lastName = (row['Last Name'] || '').trim();
      const email = (row['Email'] || '').trim().toLowerCase();
      const phone = (row['Phone'] || '').trim().replace(/^\'+/, '');
      const notes = (row['Notes'] || '').trim();
      const daysSince = parseInt(row['Days Since Last Appointment']) || null;
      const banned = row['Banned'] === 'Y';

      // Skip banned, empty names, or placeholder rows
      if (banned) { skipped++; continue; }
      if (!firstName || firstName === "'-" || firstName === '-') { skipped++; continue; }

      // Determine status based on days since last appointment
      let status = 'active';
      if (daysSince !== null && daysSince > 90) {
        status = 'paused';
      }

      const memberDoc = {
        firstName,
        lastName,
        email: email || null,
        phone: phone || null,
        notes,
        status,
        daysSinceLastAppt: daysSince,
        pkg: '',
        credits: null,
        billing: null,
        card: null,
        source: 'acuity_csv',
        createdAt: new Date(),
      };

      if (email) {
        const existing = await col.findOne({ email });
        if (existing) {
          await col.updateOne({ email }, { $set: { ...memberDoc, createdAt: existing.createdAt } });
          updated++;
        } else {
          await col.insertOne(memberDoc);
          inserted++;
        }
      } else {
        const existing = await col.findOne({ firstName, lastName });
        if (!existing) {
          await col.insertOne(memberDoc);
          inserted++;
        } else {
          skipped++;
        }
      }
    }

    return res.status(200).json({ inserted, updated, skipped, total: rows.length });
  } catch (err) {
    console.error('Import error:', err);
    return res.status(500).json({ error: err.message });
  }
}
