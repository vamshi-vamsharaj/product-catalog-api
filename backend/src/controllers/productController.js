
import productService from '../services/productService.js';
import { decodeCursor } from '../utils/cursor.js';

export async function listProducts(req, res, next) {
  try {
    const limit    = req.validatedLimit;
    const category = req.validatedCategory;
    const cursor   = req.validatedCursor;

   
    let snapshotTime;

    if (!cursor) {
      snapshotTime = new Date().toISOString();
    } else {
      const decoded = decodeCursor(cursor); // throws AppError on bad cursor
      snapshotTime  = decoded.snapshotTime ?? new Date().toISOString();
    }

    const result = await productService.listProducts({
      category,
      limit,
      cursor,
      snapshotTime,
    });

    return res.json({
      data: result.products,
      pagination: {
        nextCursor:   result.nextCursor,
        hasNextPage:  result.hasNextPage,
        snapshotTime: result.snapshotTime,
        limit,
      },
    });

  } catch (err) {
    next(err);
  }
}