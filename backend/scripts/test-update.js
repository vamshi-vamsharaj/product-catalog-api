import pool from '../src/config/db.js';

await pool.query(`
  UPDATE products
  SET
    name = 'UPDATED DURING TEST',
    updated_at = NOW()
  WHERE id = 60291
`);

console.log('Updated');
process.exit(0);