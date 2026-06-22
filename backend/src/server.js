
import 'dotenv/config';
import app from './app.js';
import pool from './config/db.js';

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await pool.query('SELECT 1');
    console.log('✓ Database connectivity verified');
  } catch (err) {
    console.error('✗ Cannot connect to database:', err.message);
    console.error('  Check DATABASE_URL in your .env file');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log(`  Health: http://localhost:${PORT}/health`);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

start();