'use client';

import { ReactNode } from 'react';
import { clsx } from 'clsx';

type Variant = 'default' | 'glass' | 'stat' | 'bordered';

export function AdminCard({
  children,
  className,
  variant = 'default',
  hover = true,
  padding = true,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  hover?: boolean;
  padding?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'rounded-2xl transition-all duration-300',
        padding && 'p-6',
        variant === 'default' && 'bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700',
        variant === 'glass' && 'bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl shadow-lg ring-1 ring-white/20 dark:ring-slate-600/30',
        variant === 'stat' && 'bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-md ring-1 ring-slate-100 dark:ring-slate-700',
        variant === 'bordered' && 'border-2 border-dashed border-slate-200 dark:border-slate-700 bg-transparent',
        hover && 'hover:shadow-lg hover:-translate-y-0.5',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}
