
'use client';

import { useState, useEffect }   from 'react';
import { CategoryFilter }        from '@/components/CategoryFilter';
import { ProductGrid }           from '@/components/ProductGrid';
import { LoadingSkeleton }       from '@/components/LoadingSkeleton';
import { fetchCategories }       from '@/lib/api';
import { usePaginatedProducts }  from '@/hooks/usePaginatedProducts';

interface ProductCatalogClientProps {
  initialCategories: string[];
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatSnapshot(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour:   '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

// ── Component ──────────────────────────────────────────────────────────────────

export function ProductCatalogClient({ initialCategories }: ProductCatalogClientProps) {

  // ── Category state ──────────────────────────────────────────────────
  const [category, setCategory] = useState('All');

  const [categories, setCategories]               = useState<string[]>(initialCategories);
  const [categoriesLoading, setCategoriesLoading] = useState(initialCategories.length === 0);
  const [categoriesError, setCategoriesError]     = useState<string | null>(null);

  // ── Pagination via hook ─────────────────────────────────────────────
  const {
    products,
    currentPage,
    hasNextPage,
    hasPrevPage,
    loading,
    error,
    snapshotTime,
    goToNext,
    goToPrev,
    reset,
  } = usePaginatedProducts('All');


  useEffect(() => {
    if (initialCategories.length > 0) return;

    const controller = new AbortController();

    fetchCategories(controller.signal)
      .then(data => {
        setCategories(data);
        setCategoriesError(null);
      })
      .catch(err => {
        if ((err as Error).name === 'AbortError') return;
        setCategoriesError(
          err instanceof Error ? err.message : 'Failed to load categories'
        );
      })
      .finally(() => setCategoriesLoading(false));

    return () => controller.abort();
  }, [initialCategories.length]);

  // ── Category change ─────────────────────────────────────────────────
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    reset(newCategory);
  };

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <>
      {/* Page header: title + snapshot indicator */}
      <div className="mb-8">
        <div className="flex items-baseline gap-3 mb-1">
          <h1 className="text-lg font-semibold tracking-tight text-[hsl(var(--app-text-primary))]">
            Product Catalog
          </h1>
          {!loading && !error && products.length > 0 && (
            <span
              className="text-sm text-[hsl(var(--app-text-muted))]"
              aria-live="polite"
            >
              Page {currentPage}
            </span>
          )}
        </div>

        {snapshotTime && !loading && (
          <p className="text-xs text-[hsl(var(--app-text-muted))] mt-1 flex items-center gap-1.5">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500/60 flex-shrink-0"
              aria-hidden="true"
            />
            Session snapshot at {formatSnapshot(snapshotTime)}
            <span
              className="text-[hsl(var(--app-text-muted))] mx-0.5 opacity-50"
              aria-hidden="true"
            >
              ·
            </span>
            <span className="text-[hsl(var(--app-text-muted))] opacity-70">
              Updates won&apos;t shift pages
            </span>
          </p>
        )}
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <CategoryFilter
          categories={categories}
          selected={category}
          onChange={handleCategoryChange}
          loading={categoriesLoading}
          error={categoriesError}
          disabled={loading}
        />

        <div
          className="hidden sm:flex items-center gap-1.5 text-xs text-[hsl(var(--app-text-muted))] flex-shrink-0"
          aria-label="Sorted by most recently updated"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M6 2v8M3 8l3 3 3-3"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Updated recently
        </div>
      </div>

      <div
        className="border-t mb-6 border-[hsl(var(--app-border))]"
        aria-hidden="true"
      />

      {/* Content area */}
      <div aria-live="polite" aria-busy={loading}>
        {error ? (
          <ErrorState
            message={error}
            onRetry={() => reset(category)}
          />
        ) : loading ? (
          <LoadingSkeleton count={20} />
        ) : products.length === 0 ? (
          <EmptyState category={category} />
        ) : (
          <ProductGrid products={products} category={category} />
        )}
      </div>

      {/* Pagination controls */}
      {!error && (
        <PaginationControls
          currentPage={currentPage}
          hasPrevPage={hasPrevPage}
          hasNextPage={hasNextPage}
          loading={loading}
          onPrev={goToPrev}
          onNext={goToNext}
        />
      )}
    </>
  );
}


interface PaginationControlsProps {
  currentPage: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  loading:     boolean;
  onPrev:      () => void;
  onNext:      () => void;
}

function PaginationControls({
  currentPage,
  hasPrevPage,
  hasNextPage,
  loading,
  onPrev,
  onNext,
}: PaginationControlsProps) {
  const prevDisabled = !hasPrevPage || loading;
  const nextDisabled = !hasNextPage || loading;

  const btnBase = `
    inline-flex items-center gap-2 px-4 py-2
    rounded-lg border text-sm font-medium
    transition-all duration-150
    focus-visible:outline-none focus-visible:ring-2
    focus-visible:ring-indigo-500 focus-visible:ring-offset-2
    focus-visible:ring-offset-[hsl(var(--app-bg))]
    disabled:opacity-30 disabled:cursor-not-allowed
  `;

  const btnEnabled = `
    bg-[hsl(var(--app-btn-bg))]
    border-[hsl(var(--app-btn-border))]
    text-[hsl(var(--app-btn-text))]
    hover:bg-[hsl(var(--app-btn-hover-bg))]
    hover:border-[hsl(var(--app-btn-hover-border))]
    hover:text-[hsl(var(--app-text-primary))]
    disabled:hover:bg-[hsl(var(--app-btn-bg))]
    disabled:hover:border-[hsl(var(--app-btn-border))]
    disabled:hover:text-[hsl(var(--app-btn-text))]
  `;

  return (
    <div className="mt-10 flex items-center justify-center gap-3">
      {/* Previous */}
      <button
        onClick={onPrev}
        disabled={prevDisabled}
        aria-label="Go to previous page"
        className={`${btnBase} ${btnEnabled}`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M9 11L5 7l4-4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Previous
      </button>

      {/* Page indicator */}
      <div
        className="
          px-4 py-2 min-w-[80px] text-center
          rounded-lg border text-sm font-medium
          bg-[hsl(var(--app-btn-bg))]
          border-[hsl(var(--app-border))]
        "
        aria-live="polite"
        aria-label={`Current page ${currentPage}`}
      >
        {loading ? (
          <span className="inline-flex items-center justify-center text-[hsl(var(--app-text-muted))]">
            <svg
              className="animate-spin"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="7" cy="7" r="5.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeOpacity="0.25"
              />
              <path
                d="M7 1.5A5.5 5.5 0 0 1 12.5 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        ) : (
          <span className="text-[hsl(var(--app-text-secondary))]">
            Page{' '}
            <span className="text-[hsl(var(--app-text-primary))] font-semibold">
              {currentPage}
            </span>
          </span>
        )}
      </div>

      {/* Next */}
      <button
        onClick={onNext}
        disabled={nextDisabled}
        aria-label="Go to next page"
        className={`${btnBase} ${btnEnabled}`}
      >
        Next
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M5 3l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

// ── ErrorState ─────────────────────────────────────────────────────────────────

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center py-24 gap-4">
      <div
        className="
          w-10 h-10 rounded-xl flex items-center justify-center
          bg-red-500/10 border border-red-500/20
        "
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 5v4M8 11h.01" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="8" cy="8" r="6.5" stroke="#EF4444" strokeWidth="1.2" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-[hsl(var(--app-text-primary))] mb-1">
          Failed to load products
        </p>
        <p className="text-xs text-[hsl(var(--app-text-muted))] mb-4 max-w-xs">
          {message}
        </p>
        <button
          onClick={onRetry}
          className="
            text-xs font-medium text-indigo-400 hover:text-indigo-300
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-indigo-500 rounded
            transition-colors duration-150
          "
        >
          Try again
        </button>
      </div>
    </div>
  );
}

// ── EmptyState ─────────────────────────────────────────────────────────────────

interface EmptyStateProps {
  category: string;
}

function EmptyState({ category }: EmptyStateProps) {
  return (
    <div role="status" className="flex flex-col items-center justify-center py-24 gap-4">
      <div
        className="
          w-10 h-10 rounded-xl flex items-center justify-center
          bg-[hsl(var(--app-tag-bg))]
          border border-[hsl(var(--app-border))]
        "
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path
            d="M3 5h12M3 9h8M3 13h5"
            stroke="hsl(var(--app-text-muted))"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-[hsl(var(--app-text-secondary))] mb-1">
          No products found
        </p>
        <p className="text-xs text-[hsl(var(--app-text-muted))] max-w-xs">
          {category !== 'All'
            ? `No products in "${category}". Try a different category.`
            : 'No products found. Run the seed script to populate the database.'}
        </p>
      </div>
    </div>
  );
}