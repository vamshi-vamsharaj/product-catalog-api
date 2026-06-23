'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="
        inline-flex items-center justify-center
        w-8 h-8 rounded-lg
        border border-zinc-700 dark:border-zinc-700
        bg-zinc-100 dark:bg-zinc-900
        text-zinc-600 dark:text-zinc-400
        hover:bg-zinc-200 dark:hover:bg-zinc-800
        hover:text-zinc-900 dark:hover:text-zinc-100
        hover:border-zinc-400 dark:hover:border-zinc-600
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-indigo-500 focus-visible:ring-offset-2
        focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0A0A0B]
        transition-all duration-150
      "
    >

      {!mounted ? (
        <span className="w-3.5 h-3.5" aria-hidden="true" />
      ) : isDark ? (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}