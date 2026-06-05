import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const client = await clientPromise;
  const db = client.db('studio-memberships');
  const col = db.collection('members');

  const { members } = req.body;
  if (!Array.isArray(members) || members.length === 0) {
    return res.status(400).json({ error: 'No members provided' });
  }

  const docs = members.map(m => ({
    firstName: m.firstName || m['First Name'] || m.first || '',
    lastName: m.lastName || m['Last Name'] || m.last || '',
    email: m.email || m['Email'] || '',
    phone: m.phone || m['Phone'] || '',
    pkg: m.pkg || m['Package'] || m['Membership'] || '',
    credits: parseInt(m.credits || m['Credits'] || 0) || 0,
    billing: m.billing || m['Next Billing'] || '',
    card: m.card || m['Card Last 4'] || '',
    status: (m.status || m['Status'] || 'active').toLowerCase(),
    notes: m.notes || m['Notes'] || '',
    lastBook: m.lastBook || m['Last Booking'] || '',
    createdAt: new Date(),
  }));

  const result = await col.insertMany(docs);
  return res.status(201).json({ inserted: result.insertedCount });
}
