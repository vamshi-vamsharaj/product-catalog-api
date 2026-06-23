import { Header }               from '@/components/Header';
import { ProductCatalogClient } from '@/components/ProductCatalogClient';

async function getInitialCategories(): Promise<string[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'}/api/categories`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) return [];

    const data = await res.json();

    return Array.isArray(data.data)
      ? data.data
      : [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const initialCategories = await getInitialCategories();

  return (
    <div
      className="
        min-h-screen transition-colors duration-200
        bg-[hsl(var(--app-bg))] text-[hsl(var(--app-text-primary))]
      "
    >
      <Header />
      <main
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        role="main"
        aria-label="Product catalog"
      >
        <ProductCatalogClient initialCategories={initialCategories} />
      </main>
    </div>
  );
}