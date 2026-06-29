'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { clsx } from 'clsx';

type SearchItem = {
  title: string;
  href: string;
  category: string;
  icon?: React.ReactNode;
};

const QUICK_LINKS: SearchItem[] = [
  { title: 'Dashboard', href: '/admin', category: 'Pages' },
  { title: 'Services', href: '/admin/services', category: 'Content' },
  { title: 'Doctors', href: '/admin/doctors', category: 'Content' },
  { title: 'Blog Posts', href: '/admin/blog', category: 'Content' },
  { title: 'Technology', href: '/admin/technology', category: 'Content' },
  { title: 'Testimonials', href: '/admin/testimonials', category: 'Content' },
  { title: 'Before & After', href: '/admin/before-after', category: 'Content' },
  { title: 'Gallery', href: '/admin/gallery', category: 'Content' },
  { title: 'Media Library', href: '/admin/media', category: 'Media' },
  { title: 'Bookings', href: '/admin/bookings', category: 'Management' },
  { title: 'Leads / CRM', href: '/admin/leads', category: 'Management' },
  { title: 'Careers', href: '/admin/careers', category: 'Management' },
  { title: 'Jobs', href: '/admin/jobs', category: 'Management' },
  { title: 'FAQ', href: '/admin/faq', category: 'Content' },
  { title: 'About Page', href: '/admin/about', category: 'Pages' },
  { title: 'Page Builder', href: '/admin/pages', category: 'Pages' },
  { title: 'Website Settings', href: '/admin/settings', category: 'System' },
];

export function AdminSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Listen for Cmd+K / Ctrl+K
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const filtered = query
    ? QUICK_LINKS.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      )
    : QUICK_LINKS;

  const grouped = filtered.reduce<Record<string, SearchItem[]>>((acc, item) => {
    (acc[item.category] ||= []).push(item);
    return acc;
  }, {});

  const navigate = useCallback((href: string) => {
    setOpen(false);
    router.push(href);
  }, [router]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]" onClick={() => setOpen(false)}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative flex items-start justify-center pt-[15vh]" onClick={(e) => e.stopPropagation()}>
        <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-800 shadow-2xl ring-1 ring-slate-200 dark:ring-slate-700 overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-700 px-4">
            <Search className="h-5 w-5 text-slate-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search pages, settings, content..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent py-4 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none"
            />
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-2 py-0.5 text-[10px] font-mono text-slate-400">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto p-2">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {category}
                </p>
                {items.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => navigate(item.href)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-600 dark:hover:text-brand-400 transition-colors group"
                  >
                    <span>{item.title}</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="px-3 py-8 text-center text-sm text-slate-400 dark:text-slate-500">
                No results for &quot;{query}&quot;
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
