
import categoryService from '../services/categoryService.js';

export async function listCategories(_req, res, next) {
  try {
    const categories = await categoryService.listCategories();

    return res.json({
      data: categories,
      meta: {
        count: categories.length,
      },
    });
  } catch (err) {
    next(err);
  }
}