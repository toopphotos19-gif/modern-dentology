'use client';

import { Bell, Search } from 'lucide-react';
import { DarkModeToggle } from '@/components/admin/ui/DarkModeToggle';
import { AdminSearch } from '@/components/admin/ui/AdminSearch';
import { ToastProvider } from '@/components/admin/ui/AdminToast';

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Top Bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
            className="hidden md:flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Search className="h-4 w-4" />
            <span>Search...</span>
            <kbd className="rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">⌘K</kbd>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative rounded-xl p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
          </button>
          <DarkModeToggle />
          <div className="hidden sm:flex items-center gap-2 ml-2 pl-3 border-l border-slate-200 dark:border-slate-700">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-xs font-bold text-white">
              A
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10">
        {children}
      </main>

      {/* Providers */}
      <AdminSearch />
      <ToastProvider />
    </>
  );
}
