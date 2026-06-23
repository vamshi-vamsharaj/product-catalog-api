
import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:              { rejectUnauthorized: false },
  max:              5,
  idleTimeoutMillis:    30_000,
  connectionTimeoutMillis: 5_000,
  statement_timeout: 10_000,
});

pool.on('connect', () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('✓ PostgreSQL connected');
  }
});

pool.on('error', (err) => {
  console.error('[ERROR] PostgreSQL pool error:', err.message);
});

export default pool;