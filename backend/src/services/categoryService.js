import pool from '../config/db.js';

const categoryService = {
  async listCategories() {
    const { rows } = await pool.query(`
      SELECT DISTINCT category
      FROM   products
      ORDER  BY category ASC
    `);

    return rows.map(r => r.category);
  },
};

export default categoryService;