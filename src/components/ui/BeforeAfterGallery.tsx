'use client';

import { useState } from 'react';
import { BeforeAfterSlider } from '@/components/ui/BeforeAfterSlider';
import { AdminModal } from '@/components/admin/ui/AdminModal';
import { Search, Filter } from 'lucide-react';
import { clsx } from 'clsx';
import Link from 'next/link';

type Comparison = {
  id: string;
  slug: string;
  treatmentName: string;
  beforeImage: string;
  afterImage: string;
  beforeImageAlt?: string;
  afterImageAlt?: string;
  shortDescription?: string;
  categoryName: string;
  categorySlug: string;
  featured: boolean;
  doctorName?: string;
};

type Category = {
  name: string;
  slug: string;
};

export function BeforeAfterGallery({
  comparisons,
  categories,
}: {
  comparisons: Comparison[];
  categories: Category[];
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = comparisons.filter((c) => {
    if (activeCategory !== 'all' && c.categorySlug !== activeCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      return c.treatmentName.toLowerCase().includes(q) ||
             c.categoryName.toLowerCase().includes(q) ||
             (c.doctorName || '').toLowerCase().includes(q);
    }
    return true;
  });

  const selected = selectedId ? comparisons.find((c) => c.id === selectedId) : null;
  const selectedIndex = selected ? filtered.findIndex((c) => c.id === selected.id) : -1;

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={clsx(
              'rounded-full px-4 py-2 text-sm font-medium transition-all',
              activeCategory === 'all'
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
            )}
          >
            All Results
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={clsx(
                'rounded-full px-4 py-2 text-sm font-medium transition-all',
                activeCategory === cat.slug
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search comparisons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
          />
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-500">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg font-medium text-slate-400">No comparisons found</p>
          <p className="mt-2 text-sm text-slate-400">Try a different filter or search term.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((comp) => (
            <div
              key={comp.id}
              className="group rounded-2xl overflow-hidden bg-white shadow-md ring-1 ring-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedId(comp.id)}
            >
              <BeforeAfterSlider
                beforeImage={comp.beforeImage}
                afterImage={comp.afterImage}
                beforeAlt={comp.beforeImageAlt}
                afterAlt={comp.afterImageAlt}
                className="aspect-[4/3]"
              />
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">{comp.treatmentName}</h3>
                  {comp.featured && (
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">Featured</span>
                  )}
                </div>
                <p className="mt-1 text-xs text-brand-500 font-medium">{comp.categoryName}</p>
                {comp.shortDescription && (
                  <p className="mt-2 text-sm text-slate-500 line-clamp-2">{comp.shortDescription}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full-screen Modal */}
      {selected && (
        <AdminModal
          open={!!selected}
          onClose={() => setSelectedId(null)}
          size="xl"
          title={selected.treatmentName}
          description={selected.categoryName}
        >
          <div className="space-y-4">
            <BeforeAfterSlider
              beforeImage={selected.beforeImage}
              afterImage={selected.afterImage}
              beforeAlt={selected.beforeImageAlt}
              afterAlt={selected.afterImageAlt}
              className="aspect-video"
            />
            {selected.shortDescription && (
              <p className="text-slate-600">{selected.shortDescription}</p>
            )}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
              {/* Prev / Next */}
              {selectedIndex > 0 && (
                <button
                  onClick={() => setSelectedId(filtered[selectedIndex - 1].id)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
                >
                  ← Previous
                </button>
              )}
              <div className="flex-1" />
              {selectedIndex < filtered.length - 1 && (
                <button
                  onClick={() => setSelectedId(filtered[selectedIndex + 1].id)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
                >
                  Next →
                </button>
              )}
            </div>
            <Link
              href="/appointment"
              className="block w-full rounded-xl bg-brand-500 py-3 text-center font-semibold text-white shadow-lg hover:bg-brand-600 transition"
            >
              Book Appointment
            </Link>
          </div>
        </AdminModal>
      )}
    </div>
  );
}
