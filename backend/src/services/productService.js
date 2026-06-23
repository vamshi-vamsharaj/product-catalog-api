
import pool from '../config/db.js';
import { encodeCursor, decodeCursor } from '../utils/cursor.js';

const productService = {


  async listProducts({ category, limit, cursor, snapshotTime }) {
    const conditions = [];
    const params     = [];

    if (category) {
      params.push(category);
      conditions.push(`category = $${params.length}`);
    }

    params.push(snapshotTime);
    conditions.push(`updated_at <= $${params.length}`);

    if (cursor) {
      const decoded = decodeCursor(cursor);

      params.push(decoded.updatedAt, decoded.id);
      const p1 = params.length - 1;
      const p2 = params.length;

      conditions.push(`(updated_at, id) < ($${p1}, $${p2})`);
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;
    params.push(limit + 1);
    const limitParam = `$${params.length}`;

    const sql = `
      SELECT
        id,
        name,
        category,
        price,
        created_at,
        updated_at
      FROM   products
      ${whereClause}
      ORDER  BY updated_at DESC, id DESC
      LIMIT  ${limitParam}
    `;

    const { rows } = await pool.query(sql, params);

    const hasNextPage  = rows.length > limit;
    const visibleRows  = hasNextPage ? rows.slice(0, limit) : rows;

    const nextCursor = hasNextPage
      ? encodeCursor(visibleRows[visibleRows.length - 1], snapshotTime)
      : null;

    return {
      products:    visibleRows,
      nextCursor,
      hasNextPage,
      snapshotTime,
    };
  },
};

export default productService;