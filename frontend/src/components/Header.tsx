// frontend/src/components/Header.tsx
import { ThemeToggle } from '@/components/ThemeToggle';

export function Header() {
  return (
    <header
      className="
        border-b sticky top-0 z-10
        bg-[hsl(var(--app-header-bg))]
        border-[hsl(var(--app-header-border))]
        transition-colors duration-200
      "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Wordmark */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-indigo-500 flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <rect x="1" y="1" width="5" height="5" rx="1" fill="white" fillOpacity="0.9"/>
                  <rect x="8" y="1" width="5" height="5" rx="1" fill="white" fillOpacity="0.5"/>
                  <rect x="1" y="8" width="5" height="5" rx="1" fill="white" fillOpacity="0.5"/>
                  <rect x="8" y="8" width="5" height="5" rx="1" fill="white" fillOpacity="0.9"/>
                </svg>
              </div>
              <span
                className="
                  text-sm font-semibold tracking-tight
                  text-[hsl(var(--app-text-primary))]
                "
              >
                CodeVector
              </span>
            </div>
            <span className="text-[hsl(var(--app-text-muted))] text-sm" aria-hidden="true">/</span>
            <span className="text-sm text-[hsl(var(--app-text-secondary))]">Products</span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Live product count */}
            <div
              className="hidden sm:flex items-center gap-1 text-xs text-[hsl(var(--app-text-muted))]"
              aria-label="200,000 products available"
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"
                aria-hidden="true"
              />
              200,000 products
            </div>

            {/* Theme toggle */}
            <ThemeToggle />
          </div>

        </div>
      </div>
    </header>
  );
}