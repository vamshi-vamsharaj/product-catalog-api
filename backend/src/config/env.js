
export function validateEnv() {
  const required = {
    DATABASE_URL: 'Neon PostgreSQL connection string',
  };

  const optional = {
    PORT:        { default: '3000',                  description: 'HTTP server port' },
    NODE_ENV:    { default: 'development',           description: 'Runtime environment' },
    CORS_ORIGIN: { default: 'http://localhost:3001', description: 'Allowed frontend origin' },
  };


  const missing = Object.entries(required)
    .filter(([key]) => !process.env[key])
    .map(([key, desc]) => `  ${key}: ${desc}`);

  if (missing.length > 0) {
    console.error('\n✗ Missing required environment variables:\n');
    missing.forEach(m => console.error(m));
    console.error('\n  Copy backend/.env.example to backend/.env and fill in values.\n');
    process.exit(1);
  }


  for (const [key, { default: def }] of Object.entries(optional)) {
    if (!process.env[key]) {
      process.env[key] = def;
    }
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
    console.error('\n✗ DATABASE_URL does not look like a PostgreSQL connection string.');
    console.error('  Expected: postgresql://user:pass@host/db?sslmode=require\n');
    process.exit(1);
  }
}