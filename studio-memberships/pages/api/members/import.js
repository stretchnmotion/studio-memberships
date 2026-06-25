// pages/api/members/import.js
// Handles CSV import from Acuity client export
// Columns: First Name, Last Name, Phone, Email, Notes, Days Since Last Appointment, Banned
// SAFE: never overwrites existing pkg, status, or source if already set
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

      if (email) {
        const existing = await col.findOne({ email });
        if (existing) {
          // SAFE UPDATE — only update contact info and visit recency
          // NEVER overwrite pkg, status, source, or billing if already set
          const safeUpdate = {
            firstName,
            lastName,
            phone: phone || existing.phone || null,
            notes: notes || existing.notes || '',
            daysSinceLastAppt: daysSince,
            // Only update status if member has no package and status is still default
            ...(!existing.pkg && existing.status !== 'active' ? { status: daysSince !== null && daysSince > 90 ? 'paused' : 'active' } : {}),
          };
          await col.updateOne({ email }, { $set: safeUpdate });
          updated++;
        } else {
          // New member — insert with default status based on days since visit
          const status = daysSince !== null && daysSince > 90 ? 'paused' : 'active';
          await col.insertOne({
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
          });
          inserted++;
        }
      } else {
        // No email — match by full name only, skip if already exists
        const existing = await col.findOne({ firstName, lastName });
        if (!existing) {
          const status = daysSince !== null && daysSince > 90 ? 'paused' : 'active';
          await col.insertOne({
            firstName,
            lastName,
            email: null,
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
          });
          inserted++;
        } else {
          // Already exists, just update days since last appt
          await col.updateOne({ firstName, lastName }, { $set: { daysSinceLastAppt: daysSince } });
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
