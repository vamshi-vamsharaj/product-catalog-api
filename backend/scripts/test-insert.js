import pool from '../src/config/db.js';

for (let i = 1; i <= 50; i++) {
  await pool.query(
    `
    INSERT INTO products
    (
      name,
      category,
      price,
      created_at,
      updated_at
    )
    VALUES ($1,$2,$3,NOW(),NOW())
    `,
    [
      `TEST PRODUCT ${i}`,
      'Electronics',
      999.99,
    ]
  );
}

console.log('Inserted 50 products');
process.exit(0);