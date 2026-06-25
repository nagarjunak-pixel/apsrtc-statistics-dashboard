import React from 'react';
import { Sun, Moon, Bus } from 'lucide-react';

export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0c0f] sticky top-0 z-50 transition-colors">
      <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600/10 text-blue-600 dark:text-blue-400 rounded-lg">
            <Bus className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                Government of Andhra Pradesh
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              APSRTC Operational & Financial Analytics
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
              Database Sync
            </span>
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
              Live (FY 2025-2026)
            </span>
          </div>

          <button
            onClick={onToggleTheme}
            className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors shadow-sm"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4.5 w-4.5" />
            ) : (
              <Moon className="h-4.5 w-4.5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
