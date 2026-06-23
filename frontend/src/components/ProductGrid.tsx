'use client';

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  created_at: string;
  updated_at: string;
}

import { ProductCard } from './ProductCard';
import { EmptyState }  from './EmptyState';

interface ProductGridProps {
  products: Product[];
  category: string;
}

export function ProductGrid({ products, category }: ProductGridProps) {
  if (products.length === 0) {
    return <EmptyState category={category} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}