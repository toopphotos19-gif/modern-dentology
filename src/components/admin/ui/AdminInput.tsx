'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

type Props = {
  label?: string;
  error?: string;
  helpText?: string;
  icon?: React.ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

export const AdminInput = forwardRef<HTMLInputElement, Props>(
  ({ label, error, helpText, icon, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            {...props}
            className={clsx(
              'w-full rounded-xl border bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 transition-all duration-200',
              'placeholder:text-slate-400 dark:placeholder:text-slate-500',
              'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500',
              error
                ? 'border-red-400 focus:ring-red-500/30 focus:border-red-500'
                : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500',
              icon && 'pl-10',
              className
            )}
          />
        </div>
        {error && <p className="text-xs text-red-500 flex items-center gap-1">⚠ {error}</p>}
        {helpText && !error && <p className="text-xs text-slate-400 dark:text-slate-500">{helpText}</p>}
      </div>
    );
  }
);

AdminInput.displayName = 'AdminInput';
