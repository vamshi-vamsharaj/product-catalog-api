
export class AppError extends Error {
  constructor(code, message, statusCode = 400) {
    super(message);
    this.code       = code;
    this.statusCode = statusCode;
  }
}

// ── Validation constants ──────────────────────────────────────────────────────
const LIMIT_MIN     = 1;
const LIMIT_MAX     = 100;
const LIMIT_DEFAULT = 20;
const CATEGORY_MAX_LENGTH = 100;


export function validateLimit(req, _res, next) {
  const raw = req.query.limit;

  if (raw === undefined) {
    req.validatedLimit = LIMIT_DEFAULT;
    return next();
  }

  const parsed = parseInt(raw, 10);

  if (isNaN(parsed) || !Number.isFinite(parsed)) {
    return next(new AppError(
      'INVALID_LIMIT',
      `limit must be an integer between ${LIMIT_MIN} and ${LIMIT_MAX}`
    ));
  }

  req.validatedLimit = Math.min(Math.max(LIMIT_MIN, parsed), LIMIT_MAX);
  next();
}

export function validateCategory(req, _res, next) {
  const raw = req.query.category;

  if (!raw) {
    req.validatedCategory = null;
    return next();
  }

  const trimmed = String(raw).trim();

  if (trimmed.length === 0) {
    req.validatedCategory = null;
    return next();
  }

  if (trimmed.length > CATEGORY_MAX_LENGTH) {
    return next(new AppError(
      'INVALID_CATEGORY',
      `category must be ${CATEGORY_MAX_LENGTH} characters or fewer`
    ));
  }

  req.validatedCategory = trimmed;
  next();
}

export function validateCursor(req, _res, next) {
  const raw = req.query.cursor;

  if (!raw) {
    req.validatedCursor = null;
    return next();
  }

  const str = String(raw).trim();

  if (str.length === 0) {
    req.validatedCursor = null;
    return next();
  }


  if (str.length > 512) {
    return next(new AppError(
      'INVALID_CURSOR',
      'Cursor is malformed'
    ));
  }

  req.validatedCursor = str;
  next();
}