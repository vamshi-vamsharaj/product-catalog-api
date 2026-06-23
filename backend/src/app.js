
import express   from 'express';
import cors      from 'cors';
import morgan    from 'morgan';
import 'dotenv/config';

import productsRouter   from './routes/products.js';
import categoriesRouter from './routes/categories.js';

const app = express();


app.use(cors({
  origin:         process.env.CORS_ORIGIN || 'http://localhost:3001',
  methods:        ['GET'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

morgan.token('response-time-ms', (req, res) => {
  const rt = res.getHeader('X-Response-Time');
  return rt ? `${rt}ms` : '-';
});

app.use(morgan(':method :url :status :response-time ms'));


app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});

// ── Health check ───────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status:      'ok',
    timestamp:   new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version:     process.env.npm_package_version ?? '1.0.0',
  });
});

// ── API routes ─────────────────────────────────────────────────────────────────
app.use('/api/products',   productsRouter);
app.use('/api/categories', categoriesRouter);

// ── 404 ────────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    error: {
      code:    'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
});


app.use((err, req, res, _next) => {
  // AppError: client mistake — log at warn level, return 4xx
  if (err.code && err.statusCode && err.statusCode < 500) {
    console.warn(`[WARN] ${req.method} ${req.path} — ${err.code}: ${err.message}`);
    return res.status(err.statusCode).json({
      error: {
        code:    err.code,
        message: err.message,
      },
    });
  }

  // PostgreSQL errors — map to human-readable messages
  // pg error codes: https://www.postgresql.org/docs/current/errcodes-appendix.html
  if (err.code === '08006' || err.code === '08001' || err.code === '08004') {
    // Connection errors
    console.error(`[ERROR] Database connection error: ${err.message}`);
    return res.status(503).json({
      error: {
        code:    'DATABASE_UNAVAILABLE',
        message: 'Database is temporarily unavailable. Please try again.',
      },
    });
  }

  if (err.code === '57014') {
    // Query cancelled (timeout)
    console.error(`[ERROR] Query timeout: ${req.method} ${req.path}`);
    return res.status(504).json({
      error: {
        code:    'QUERY_TIMEOUT',
        message: 'Query took too long. Please try again.',
      },
    });
  }

  // Unexpected server error — log full details, return generic message
  console.error(`[ERROR] Unhandled error on ${req.method} ${req.path}:`);
  console.error(err.stack);

  return res.status(500).json({
    error: {
      code:    'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred.'
        : err.message,
    },
  });
});

export default app;