
import { validateEnv } from './config/env.js';

validateEnv();

import 'dotenv/config';
import app  from './app.js';
import pool from './config/db.js';

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await pool.query('SELECT 1');
    console.log('✓ Database connectivity verified');
  } catch (err) {
    console.error('✗ Cannot connect to database:', err.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`\n✓ Server running on http://localhost:${PORT}`);
    console.log(`  Environment: ${process.env.NODE_ENV}`);
    console.log(`  Health:      http://localhost:${PORT}/health`);
    console.log(`  Products:    http://localhost:${PORT}/api/products`);
    console.log(`  Categories:  http://localhost:${PORT}/api/categories\n`);
  });
}

start();