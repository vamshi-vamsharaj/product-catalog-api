
import pg from 'pg';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __dirname = dirname(fileURLToPath(import.meta.url));
const { Pool } = pg;

const TOTAL_PRODUCTS = 200_000;

const BATCH_SIZE = 5_000;

const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Garden',
  'Sports',
  'Automotive',
];


const NOW_MS = Date.now();
const TWO_YEARS_MS = 2 * 365 * 24 * 60 * 60 * 1000;

const ADJECTIVES = [
  'Premium', 'Classic', 'Modern', 'Ultra', 'Pro', 'Elite', 'Smart',
  'Compact', 'Portable', 'Wireless', 'Advanced', 'Essential', 'Deluxe',
  'Professional', 'Lightweight', 'Heavy-Duty', 'Eco-Friendly', 'Vintage',
];

const NOUNS = [
  'Headphones', 'Keyboard', 'Monitor', 'Desk', 'Chair', 'Lamp', 'Bag',
  'Jacket', 'Sneakers', 'Watch', 'Camera', 'Tripod', 'Notebook', 'Pen',
  'Backpack', 'Wallet', 'Speaker', 'Charger', 'Cable', 'Adapter',
  'Toolkit', 'Gloves', 'Helmet', 'Boots', 'Thermos', 'Cushion', 'Mirror',
];

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPrice() {
  return (Math.random() * 998 + 1.99).toFixed(2);
}

function randomTimestamp() {
  const ms = NOW_MS - Math.random() * TWO_YEARS_MS;
  return new Date(ms).toISOString();
}

function generateProductName(index) {
  const adj = randomElement(ADJECTIVES);
  const noun = randomElement(NOUNS);
  return `${adj} ${noun} #${index + 1}`;
}


async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error('✗ DATABASE_URL not set. Check backend/.env');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 3,
  });

  console.log('🌱 Starting seed...');
  console.log(`   Total products: ${TOTAL_PRODUCTS.toLocaleString()}`);
  console.log(`   Batch size:     ${BATCH_SIZE.toLocaleString()}`);
  console.log(`   Total batches:  ${Math.ceil(TOTAL_PRODUCTS / BATCH_SIZE)}`);
  console.log(`   Params/batch:   ${BATCH_SIZE * 5} (limit: 65,535)\n`);

  try {
    await pool.query('SELECT 1');
    console.log('✓ Database connected\n');
  } catch (err) {
    console.error('✗ Cannot connect to database:', err.message);
    process.exit(1);
  }

  await pool.query('TRUNCATE TABLE products RESTART IDENTITY');
  console.log('✓ Table truncated (RESTART IDENTITY resets BIGSERIAL counter)\n');

  const totalBatches = Math.ceil(TOTAL_PRODUCTS / BATCH_SIZE);
  const startTime = Date.now();

  for (let batch = 0; batch < totalBatches; batch++) {
    const batchStart = batch * BATCH_SIZE;
    const batchEnd = Math.min(batchStart + BATCH_SIZE, TOTAL_PRODUCTS);
    const rowsInThisBatch = batchEnd - batchStart;

    const valuePlaceholders = [];
    const params = [];

    for (let i = 0; i < rowsInThisBatch; i++) {
      const globalIndex = batchStart + i;
      const paramBase = i * 5;

      const name      = generateProductName(globalIndex);
      const category  = randomElement(CATEGORIES);
      const price     = randomPrice();
      const createdAt = randomTimestamp();
      const updatedAt = createdAt;

      valuePlaceholders.push(
        `($${paramBase + 1}, $${paramBase + 2}, $${paramBase + 3}, $${paramBase + 4}, $${paramBase + 5})`
      );
      params.push(name, category, price, createdAt, updatedAt);
    }

    const sql = `
      INSERT INTO products (name, category, price, created_at, updated_at)
      VALUES ${valuePlaceholders.join(', ')}
    `;

    await pool.query(sql, params);

    if ((batch + 1) % 10 === 0 || batch === totalBatches - 1) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const inserted = Math.min((batch + 1) * BATCH_SIZE, TOTAL_PRODUCTS);
      const pct = ((inserted / TOTAL_PRODUCTS) * 100).toFixed(0);
      console.log(`  [${pct}%] ${inserted.toLocaleString()} rows — ${elapsed}s elapsed`);
    }
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n✓ Seed complete`);
  console.log(`  ${TOTAL_PRODUCTS.toLocaleString()} products inserted in ${totalTime}s`);
  console.log(`  Rate: ${Math.round(TOTAL_PRODUCTS / totalTime).toLocaleString()} rows/second`);

  const { rows } = await pool.query('SELECT COUNT(*) as count FROM products');
  console.log(`  Verified: ${parseInt(rows[0].count).toLocaleString()} rows in database\n`);

  const dist = await pool.query(`
    SELECT category, COUNT(*) as count
    FROM products
    GROUP BY category
    ORDER BY count DESC
  `);
  console.log('Category distribution:');
  dist.rows.forEach(r => {
    const bar = '█'.repeat(Math.round(parseInt(r.count) / 5000));
    console.log(`  ${r.category.padEnd(16)} ${bar} ${parseInt(r.count).toLocaleString()}`);
  });

  await pool.end();
}

seed().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});