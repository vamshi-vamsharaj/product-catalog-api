
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

export interface Product {
  id:         number;
  name:       string;
  category:   string;
  price:      string;
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  nextCursor:   string | null;
  hasNextPage:  boolean;
  snapshotTime: string;
  limit:        number;
}

export interface ProductsResponse {
  data:       Product[];
  pagination: Pagination;
}

export interface CategoriesResponse {
  data: string[];
  meta: { count: number };
}

export interface FetchProductsParams {
  category?: string;
  limit?:    number;
  cursor?:   string | null;
  signal?:   AbortSignal;
}

export async function fetchCategories(signal?: AbortSignal): Promise<string[]> {
  const res = await fetch(`${API_BASE}/api/categories`, { signal });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { error?: { message: string } }).error?.message ??
        `Failed to load categories (HTTP ${res.status})`
    );
  }

  const json: CategoriesResponse = await res.json();
  return json.data;
}

export async function fetchProducts(
  params: FetchProductsParams = {}
): Promise<ProductsResponse> {
  const { category, limit = 20, cursor, signal } = params;

  const query = new URLSearchParams();
  query.set('limit', String(limit));
  if (category && category !== 'All') query.set('category', category);
  if (cursor) query.set('cursor', cursor);

  const res = await fetch(`${API_BASE}/api/products?${query}`, { signal });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { error?: { message: string } }).error?.message ??
        `Failed to load products (HTTP ${res.status})`
    );
  }

  return res.json() as Promise<ProductsResponse>;
}