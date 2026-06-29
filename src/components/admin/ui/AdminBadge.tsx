'use client';

import { clsx } from 'clsx';

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'brand';

export function AdminBadge({
  children,
  variant = 'default',
  dot = false,
  size = 'sm',
}: {
  children: React.ReactNode;
  variant?: Variant;
  dot?: boolean;
  size?: 'xs' | 'sm' | 'md';
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 font-medium rounded-full',
        size === 'xs' && 'px-2 py-0.5 text-[10px]',
        size === 'sm' && 'px-2.5 py-0.5 text-xs',
        size === 'md' && 'px-3 py-1 text-sm',
        variant === 'default' && 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
        variant === 'success' && 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
        variant === 'warning' && 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
        variant === 'danger' && 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400',
        variant === 'info' && 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
        variant === 'brand' && 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400',
      )}
    >
      {dot && (
        <span className={clsx(
          'h-1.5 w-1.5 rounded-full',
          variant === 'default' && 'bg-slate-400',
          variant === 'success' && 'bg-emerald-500',
          variant === 'warning' && 'bg-amber-500',
          variant === 'danger' && 'bg-red-500',
          variant === 'info' && 'bg-blue-500',
          variant === 'brand' && 'bg-brand-500',
        )} />
      )}
      {children}
    </span>
  );
}
