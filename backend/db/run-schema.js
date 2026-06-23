import fs from 'fs';
import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const sql = fs.readFileSync('./db/schema.sql', 'utf8');

try {
  await pool.query(sql);
  console.log('✓ Schema applied');
} catch (err) {
  console.error(err);
} finally {
  await pool.end();
}