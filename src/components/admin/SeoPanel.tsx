'use client';

import { useState, useEffect, useMemo } from 'react';
import { AdminInput } from '@/components/admin/ui/AdminInput';
import { AdminTextarea } from '@/components/admin/ui/AdminTextarea';
import { clsx } from 'clsx';
import { Search, Globe, Twitter, Eye, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { calculateSeoScore, calculateReadabilityScore, calculateKeywordDensity, type SeoAnalysis } from '@/lib/seo';

export type SeoData = {
  metaTitle?: string;
  metaDesc?: string;
  keywords?: string;
  canonicalUrl?: string;
  robotsMeta?: string;
  focusKeyword?: string;
  ogTitle?: string;
  ogDesc?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDesc?: string;
  twitterImage?: string;
  breadcrumb?: string;
};

export function SeoPanel({
  data,
  onChange,
  slug,
  content,
  prefix = '',
}: {
  data: SeoData;
  onChange: (data: SeoData) => void;
  slug?: string;
  content?: string;
  prefix?: string; // field name prefix for form serialization
}) {
  const [activePreview, setActivePreview] = useState<'google' | 'social' | null>(null);

  // Calculate SEO score
  const analysis = useMemo<SeoAnalysis>(() => {
    return calculateSeoScore({
      title: data.metaTitle,
      metaDesc: data.metaDesc,
      focusKeyword: data.focusKeyword,
      content: content,
      slug: slug,
      images: [],
    });
  }, [data.metaTitle, data.metaDesc, data.focusKeyword, content, slug]);

  const readability = useMemo(() => {
    return calculateReadabilityScore(content || '');
  }, [content]);

  const kwDensity = useMemo(() => {
    return calculateKeywordDensity(content || '', data.focusKeyword || '');
  }, [content, data.focusKeyword]);

  function update(key: keyof SeoData, value: string) {
    onChange({ ...data, [key]: value });
  }

  return (
    <div className="space-y-6">
      {/* SEO Score Overview */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 p-4">
        {/* Score Circle */}
        <div className="relative h-16 w-16 flex-shrink-0">
          <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-200 dark:text-slate-600" />
            <circle
              cx="32" cy="32" r="28" fill="none"
              strokeWidth="4"
              strokeDasharray={`${(analysis.score / 100) * 176} 176`}
              strokeLinecap="round"
              className={clsx(
                analysis.grade === 'excellent' && 'text-emerald-500',
                analysis.grade === 'good' && 'text-blue-500',
                analysis.grade === 'needs-work' && 'text-amber-500',
                analysis.grade === 'poor' && 'text-red-500',
              )}
              stroke="currentColor"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-900 dark:text-white">
            {analysis.score}
          </span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            SEO Score: <span className={clsx(
              analysis.grade === 'excellent' && 'text-emerald-600',
              analysis.grade === 'good' && 'text-blue-600',
              analysis.grade === 'needs-work' && 'text-amber-600',
              analysis.grade === 'poor' && 'text-red-600',
            )}>{analysis.grade}</span>
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Readability: {readability.grade} ({readability.score}/100)
            {data.focusKeyword && ` · Keyword density: ${kwDensity}%`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActivePreview(activePreview === 'google' ? null : 'google')}
            className={clsx(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
              activePreview === 'google' ? 'bg-brand-500 text-white' : 'bg-white dark:bg-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-500'
            )}
          >
            <Search className="h-3 w-3" /> Google
          </button>
          <button
            type="button"
            onClick={() => setActivePreview(activePreview === 'social' ? null : 'social')}
            className={clsx(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
              activePreview === 'social' ? 'bg-brand-500 text-white' : 'bg-white dark:bg-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-500'
            )}
          >
            <Globe className="h-3 w-3" /> Social
          </button>
        </div>
      </div>

      {/* Google Search Preview */}
      {activePreview === 'google' && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-600 p-4 space-y-1">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Google Search Preview</p>
          <p className="text-lg text-blue-700 dark:text-blue-400 hover:underline cursor-pointer truncate">
            {data.metaTitle || 'Page Title — Your Site'}
          </p>
          <p className="text-sm text-emerald-700 dark:text-emerald-400 truncate">
            https://yoursite.com/{slug || 'page-url'}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
            {data.metaDesc || 'Add a meta description to control how your page appears in search results...'}
          </p>
        </div>
      )}

      {/* Social Preview */}
      {activePreview === 'social' && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-600 overflow-hidden">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider px-4 pt-3 mb-2">Social Media Preview</p>
          {data.ogImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.ogImage} alt="" className="w-full h-40 object-cover" />
          )}
          <div className="p-4 bg-slate-50 dark:bg-slate-700/50">
            <p className="text-xs text-slate-400 uppercase">yoursite.com</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">{data.ogTitle || data.metaTitle || 'Page Title'}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{data.ogDesc || data.metaDesc || 'Description'}</p>
          </div>
        </div>
      )}

      {/* SEO Checks */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Checks & Suggestions</p>
        {analysis.checks.map((check) => (
          <div key={check.id} className="flex items-start gap-2 text-sm">
            {check.status === 'pass' && <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />}
            {check.status === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />}
            {check.status === 'fail' && <Info className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />}
            <span className={clsx(
              'text-xs',
              check.status === 'pass' && 'text-slate-600 dark:text-slate-400',
              check.status === 'warning' && 'text-amber-700 dark:text-amber-400',
              check.status === 'fail' && 'text-red-700 dark:text-red-400',
            )}>
              {check.message}
            </span>
          </div>
        ))}
      </div>

      {/* Hidden inputs for form serialization */}
      {Object.entries(data).map(([key, value]) => (
        <input key={key} type="hidden" name={`${prefix}${key}`} value={value || ''} />
      ))}

      {/* Fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <AdminInput
          label="Focus Keyword"
          value={data.focusKeyword || ''}
          onChange={(e) => update('focusKeyword', e.target.value)}
          placeholder="Primary keyword to optimize for"
        />
        <AdminInput
          label="SEO Title"
          value={data.metaTitle || ''}
          onChange={(e) => update('metaTitle', e.target.value)}
          placeholder="Page title (30-60 chars)"
          helpText={`${(data.metaTitle || '').length}/60 characters`}
        />
      </div>
      <AdminTextarea
        label="Meta Description"
        value={data.metaDesc || ''}
        onChange={(e) => update('metaDesc', e.target.value)}
        placeholder="Compelling description (120-160 chars)"
        maxLength={160}
        showCount
        rows={3}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <AdminInput
          label="Keywords"
          value={data.keywords || ''}
          onChange={(e) => update('keywords', e.target.value)}
          placeholder="keyword1, keyword2, keyword3"
        />
        <AdminInput
          label="Canonical URL"
          value={data.canonicalUrl || ''}
          onChange={(e) => update('canonicalUrl', e.target.value)}
          placeholder="https://..."
        />
      </div>
      <AdminInput
        label="Breadcrumb Title"
        value={data.breadcrumb || ''}
        onChange={(e) => update('breadcrumb', e.target.value)}
        placeholder="Custom breadcrumb label"
      />

      {/* Open Graph */}
      <div className="pt-2">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Globe className="h-3 w-3" /> Open Graph (Facebook / LinkedIn)
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminInput label="OG Title" value={data.ogTitle || ''} onChange={(e) => update('ogTitle', e.target.value)} placeholder="Falls back to SEO title" />
          <AdminInput label="OG Image URL" value={data.ogImage || ''} onChange={(e) => update('ogImage', e.target.value)} placeholder="1200×630 recommended" />
        </div>
        <div className="mt-4">
          <AdminTextarea label="OG Description" value={data.ogDesc || ''} onChange={(e) => update('ogDesc', e.target.value)} rows={2} placeholder="Falls back to meta description" />
        </div>
      </div>

      {/* Twitter Card */}
      <div className="pt-2">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Twitter className="h-3 w-3" /> Twitter Card
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminInput label="Twitter Title" value={data.twitterTitle || ''} onChange={(e) => update('twitterTitle', e.target.value)} placeholder="Falls back to OG title" />
          <AdminInput label="Twitter Image URL" value={data.twitterImage || ''} onChange={(e) => update('twitterImage', e.target.value)} />
        </div>
        <div className="mt-4">
          <AdminTextarea label="Twitter Description" value={data.twitterDesc || ''} onChange={(e) => update('twitterDesc', e.target.value)} rows={2} />
        </div>
      </div>

      {/* Robots */}
      <AdminInput
        label="Robots Meta"
        value={data.robotsMeta || ''}
        onChange={(e) => update('robotsMeta', e.target.value)}
        placeholder="index, follow"
        helpText="Controls how search engines crawl this page"
      />
    </div>
  );
}
