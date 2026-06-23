
import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchProducts, type Product }               from '@/lib/api';

const PAGE_SIZE = 20;

interface PageCache {
  [page: number]: Product[];
}

interface CursorHistory {
  [page: number]: string | null;
}

export interface PaginationInfo {
  products:     Product[];
  currentPage:  number;
  hasNextPage:  boolean;
  hasPrevPage:  boolean;
  loading:      boolean;
  error:        string | null;
  snapshotTime: string | null;
  goToNext:     () => void;
  goToPrev:     () => void;
  reset:        (newCategory: string) => void;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function usePaginatedProducts(initialCategory: string): PaginationInfo {
  // ── Core navigation state ────────────────────────────────────────────────
  const [currentPage, setCurrentPage]       = useState(1);
  const [cursorHistory, setCursorHistory]   = useState<CursorHistory>({ 1: null });
  const [pageCache, setPageCache]           = useState<PageCache>({});
  const [hasNextPage, setHasNextPage]       = useState(false);
  const [snapshotTime, setSnapshotTime]     = useState<string | null>(null);

  // ── Request state ────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  // ── Refs ─────────────────────────────────────────────────────────────────
  const categoryRef  = useRef(initialCategory);
  const abortRef     = useRef<AbortController | null>(null);

  useEffect(() => {
    // If page is already cached, nothing to fetch
    if (pageCache[currentPage] !== undefined) {
      setLoading(false);
      return;
    }
    if (!(currentPage in cursorHistory)) {
      console.warn(`usePaginatedProducts: no cursor for page ${currentPage}`);
      return;
    }

    const cursor = cursorHistory[currentPage];

    // Cancel previous in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    const category = categoryRef.current;

    fetchProducts({
      category: category !== 'All' ? category : undefined,
      limit:    PAGE_SIZE,
      cursor,
      signal:   controller.signal,
    })
      .then(result => {
        if (controller.signal.aborted) return;

        // Cache this page's products
        setPageCache(prev => ({ ...prev, [currentPage]: result.data }));

        // Store next cursor so we can fetch the next page when needed
        if (result.pagination.nextCursor) {
          setCursorHistory(prev => ({
            ...prev,
            [currentPage + 1]: result.pagination.nextCursor,
          }));
        }

        setHasNextPage(result.pagination.hasNextPage);

        // Capture snapshot once — it's the same on all pages of a session
        setSnapshotTime(prev => prev ?? result.pagination.snapshotTime);
      })
      .catch(err => {
        if ((err as Error).name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Failed to load products');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [currentPage, pageCache, cursorHistory]);
  const goToNext = useCallback(() => {
    setCurrentPage(p => p + 1);

    setPageCache(prev => {
      const nextPage = currentPage + 1;
      if (prev[nextPage] !== undefined) {
        setCursorHistory(hist => {
          const knownNextNext = (nextPage + 1) in hist;
          setHasNextPage(knownNextNext);
          return hist;
        });
      }
      return prev;
    });
  }, [currentPage]);

  const goToPrev = useCallback(() => {
    if (currentPage <= 1) return;
    setCurrentPage(p => p - 1);
    setHasNextPage(true);
  }, [currentPage]);


  const reset = useCallback((newCategory: string) => {
    abortRef.current?.abort();
    categoryRef.current = newCategory;

    // Reset all state atomically
    setCurrentPage(1);
    setCursorHistory({ 1: null });
    setPageCache({});
    setHasNextPage(false);
    setSnapshotTime(null);
    setError(null);
    setLoading(true);
  }, []);

  return {
    products:    pageCache[currentPage] ?? [],
    currentPage,
    hasNextPage,
    hasPrevPage: currentPage > 1,
    loading,
    error,
    snapshotTime,
    goToNext,
    goToPrev,
    reset,
  };
}