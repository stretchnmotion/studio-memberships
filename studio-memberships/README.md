# Studio Memberships

Staff dashboard for stretch & massage therapy membership management.
Connected to MongoDB Atlas.

## Stack
- Next.js 14
- MongoDB Atlas (studio-memberships cluster)
- Vercel (hosting)

## Deploy to Vercel (5 minutes)

### 1. Push to GitHub
- Go to github.com → New repository → name it `studio-memberships`
- Upload all these files (drag and drop the folder)

### 2. Deploy on Vercel
- Go to vercel.com → Add New Project
- Import your GitHub repo
- Under **Environment Variables**, add:
  ```
  MONGODB_URI = mongodb+srv://akelly6_db_user:StreTch20N-Motion26@studio-memberships.qqyqd21.mongodb.net/studio-memberships?appName=Studio-Memberships
  ```
- Click Deploy

Your app will be live at `https://studio-memberships.vercel.app` (or similar).

### 3. Import existing members
- Export your members from Acuity as a CSV
- In the app sidebar, click **Import CSV**
- Your CSV columns can be any of:
  - First Name, Last Name, Email, Phone, Package, Credits, Billing, Card Last 4, Status, Notes

## Local development
```bash
npm install
npm run dev
```
Open http://localhost:3000

## MongoDB collections
- `members` — member records
- `flags` — flags per member (card declined, expiring, inactive, manual)
