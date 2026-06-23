# Product Catalog

A scalable product catalog application built with **Node.js, Express, PostgreSQL, and Next.js**, designed to handle large datasets efficiently using **cursor-based pagination** and **snapshot consistency**.

## Live Demo

* Frontend: https://product-catalog-api-two.vercel.app/
* Backend API: https://product-catalog-api-yreh.onrender.com/health

---

## Features

### Backend

* REST API built with Express
* PostgreSQL database hosted on Neon
* 200,000 seeded products
* Cursor-based pagination
* Snapshot consistency
* Category filtering
* Input validation middleware
* Indexed queries for high performance
* Production-ready environment configuration

### Frontend

* Next.js App Router
* TypeScript
* Responsive UI
* Category filtering
* Previous / Next navigation
* Loading states
* Empty states
* Error handling
* Dark / Light theme toggle
* Accessible components

---

## Tech Stack

### Frontend

* Next.js 15
* TypeScript
* Tailwind CSS
* next-themes

### Backend

* Node.js
* Express
* PostgreSQL
* pg
* Neon

### Deployment

* Vercel (Frontend)
* Render (Backend)
* Neon (Database)

---

## Architecture

Frontend

```text
Next.js
   ↓
REST API
   ↓
Express
   ↓
PostgreSQL (Neon)
```

Backend follows a layered architecture:

```text
Routes
  ↓
Controllers
  ↓
Services
  ↓
Database
```

---

## Database Design

Products are sorted using:

```sql
ORDER BY updated_at DESC, id DESC
```

Indexes:

```sql
CREATE INDEX idx_products_updated_id
ON products(updated_at DESC, id DESC);

CREATE INDEX idx_products_category_updated_id
ON products(category, updated_at DESC, id DESC);
```

These indexes support efficient keyset pagination and category filtering.

---

## Pagination Strategy

Instead of OFFSET/LIMIT pagination, this project uses keyset pagination.

Benefits:

* Consistent performance on large datasets
* No duplicate records
* No skipped records
* O(log N) index lookups

Cursor contains:

```json
{
  "snapshotTime": "...",
  "updatedAt": "...",
  "id": 123
}
```

---

## Snapshot Consistency

When a user starts browsing, the API captures a snapshot timestamp.

All subsequent requests are restricted to that snapshot:

```sql
WHERE updated_at <= snapshot_time
```

This guarantees:

* No duplicates
* No missing products
* Stable browsing experience

even when records are inserted or updated during navigation.

---

## Project Structure

```text
product-catalog-api/
│
├── backend/
│   ├── db/
│   ├── scripts/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       └── utils/
│
└── frontend/
    └── src/
        ├── app/
        ├── components/
        ├── hooks/
        └── lib/
```

---

## Local Setup

### Clone Repository

```bash
git clone https://github.com/vamshi-vamsharaj/product-catalog-api.git
```

### Backend

```bash
cd backend
npm install
```

Create `.env`

```env
DATABASE_URL=your_neon_database_url
PORT=3000
CORS_ORIGIN=http://localhost:3001
```

Run:

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
```

Create `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Run:

```bash
npm run dev
```

---

## Testing

Seed database:

```bash
node db/seed.js
```

Test concurrent inserts:

```bash
node scripts/test-insert.js
```

Test concurrent updates:

```bash
node scripts/test-update.js
```

---

## Future Improvements

* Search functionality
* Sorting options
* Redis caching
* Product detail pages
* Docker support
* CI/CD pipeline

---

## Author

Vamshi Vamsharaj

* GitHub: https://github.com/vamshi-vamsharaj
* Portfolio: https://vamshi-dev.netlify.app/
