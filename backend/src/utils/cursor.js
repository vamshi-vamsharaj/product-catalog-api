import { AppError } from '../middleware/validate.js';

export function encodeCursor(product, snapshotTime) {
  const payload = {
    s: snapshotTime,
    u: product.updated_at,
    i: product.id,
  };
  return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
}

export function decodeCursor(cursor) {
  let raw;
  try {
    raw = Buffer.from(cursor, 'base64url').toString('utf8');
  } catch {
    throw new AppError('INVALID_CURSOR', 'Cursor is not valid base64url');
  }

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    throw new AppError('INVALID_CURSOR', 'Cursor contains invalid JSON');
  }

  if (!payload.u || payload.i === undefined || payload.i === null) {
    throw new AppError('INVALID_CURSOR', 'Cursor is missing required fields');
  }

 const id = Number(payload.i);

if (
  typeof payload.u !== 'string' ||
  Number.isNaN(id)
) {
  throw new AppError(
    'INVALID_CURSOR',
    'Cursor fields have unexpected types'
  );
}

return {
  snapshotTime: payload.s ?? null,
  updatedAt: payload.u,
  id,
};

  if (payload.s !== undefined && typeof payload.s !== 'string') {
    throw new AppError('INVALID_CURSOR', 'Cursor snapshot field has unexpected type');
  }

  return {
    snapshotTime: payload.s ?? null,
    updatedAt:    payload.u,
    id:           payload.i,
  };
}