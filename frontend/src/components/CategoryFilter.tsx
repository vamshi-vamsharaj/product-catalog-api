'use client';

interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onChange: (category: string) => void;
  loading?: boolean;
  error?: string | null;
  disabled?: boolean;
}

export function CategoryFilter({
  categories,
  selected,
  onChange,
  loading = false,
  error = null,
  disabled = false,
}: CategoryFilterProps) {

  const allOptions = ['All', ...categories];

  if (loading) {
    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        {[64, 80, 52, 96, 60, 76, 72].map((w, i) => (
          <div
            key={i}
            className="h-7 rounded-md animate-pulse bg-[hsl(var(--app-skeleton))]"
            style={{ width: w }}
          />
        ))}
      </div>
    );
  }

  // ── Error state: subtle inline message + retry hint ──────────────────
  if (error) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-red-400">{error}</span>
        {/* Parent re-fetches on category change — clicking 'All' acts as a retry */}
        <button
          onClick={() => onChange('All')}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // ── Loaded state: interactive pill buttons ────────────────────────────
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {allOptions.map((cat) => {
        const isActive = selected === cat;
        return (
          <button
            key={cat}
            onClick={() => !disabled && onChange(cat)}
            disabled={disabled}
            className={[
              'px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              isActive
                ? 'bg-indigo-500 text-white shadow-sm shadow-indigo-500/20'
                : [
                    'border',
                    'bg-[hsl(var(--app-btn-bg))]',
                    'text-[hsl(var(--app-btn-text))]',
                    'border-[hsl(var(--app-btn-border))]',
                    'hover:bg-[hsl(var(--app-btn-hover-bg))]',
                    'hover:text-[hsl(var(--app-text-secondary))]',
                    'hover:border-[hsl(var(--app-btn-hover-border))]',
                  ].join(' '),
            ].join(' ')}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}