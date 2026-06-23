
export function ProductCardSkeleton() {
  return (
    <div
      className="
        rounded-xl overflow-hidden relative
        bg-[hsl(var(--app-surface))]
        border border-[hsl(var(--app-border)/0.6)]
      "
    >
      {/* Left accent skeleton — matches the stripe position on ProductCard */}
      <div
        className="
          absolute left-0 top-0 bottom-0 w-0.5 animate-pulse
          bg-[hsl(var(--app-skeleton))]
        "
      />

      <div className="p-4 pl-5">
        {/* Top row: badge + date */}
        <div className="flex items-center justify-between mb-3">
          <div className="h-4 w-20 rounded animate-pulse bg-[hsl(var(--app-skeleton))]" />
          <div className="h-3 w-12 rounded animate-pulse bg-[hsl(var(--app-skeleton))]" />
        </div>

        {/* Product name lines */}
        <div className="space-y-2 mb-3">
          <div className="h-3.5 w-full rounded animate-pulse bg-[hsl(var(--app-skeleton))]" />
          <div className="h-3.5 w-3/4 rounded animate-pulse bg-[hsl(var(--app-skeleton))]" />
        </div>

        {/* Bottom row: price + ID */}
        <div className="flex items-center justify-between">
          <div className="h-5 w-16 rounded animate-pulse bg-[hsl(var(--app-skeleton))]" />
          <div className="h-3 w-10 rounded animate-pulse bg-[hsl(var(--app-skeleton))]" />
        </div>
      </div>
    </div>
  );
}

interface LoadingSkeletonProps {
  count?: number;
}

export function LoadingSkeleton({ count = 20 }: LoadingSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}