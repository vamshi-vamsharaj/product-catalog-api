interface EmptyStateProps {
  category: string;
}

export function EmptyState({ category }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      {/* Icon container */}
      <div
        className="
          w-10 h-10 rounded-xl flex items-center justify-center mb-4
          bg-[hsl(var(--app-surface))]
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

      <p className="text-sm font-medium mb-1 text-[hsl(var(--app-text-secondary))]">
        No products found
      </p>

      <p className="text-xs text-center max-w-xs text-[hsl(var(--app-text-muted))]">
        {category !== 'All'
          ? `No products in the "${category}" category. Try a different filter.`
          : 'The product catalog is empty. Run the seed script to populate it.'}
      </p>
    </div>
  );
}