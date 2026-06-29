'use client';

import { TextareaHTMLAttributes, forwardRef, useState } from 'react';
import { clsx } from 'clsx';

type Props = {
  label?: string;
  error?: string;
  helpText?: string;
  maxLength?: number;
  showCount?: boolean;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const AdminTextarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ label, error, helpText, maxLength, showCount = false, className, ...props }, ref) => {
    const [count, setCount] = useState((props.defaultValue as string || '').length);

    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          {...props}
          maxLength={maxLength}
          onChange={(e) => {
            setCount(e.target.value.length);
            props.onChange?.(e);
          }}
          className={clsx(
            'w-full rounded-xl border bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-800 dark:text-slate-200 transition-all duration-200 resize-y min-h-[80px]',
            'placeholder:text-slate-400 dark:placeholder:text-slate-500',
            'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500',
            error
              ? 'border-red-400 focus:ring-red-500/30 focus:border-red-500'
              : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500',
            className
          )}
        />
        <div className="flex items-center justify-between">
          <div>
            {error && <p className="text-xs text-red-500">⚠ {error}</p>}
            {helpText && !error && <p className="text-xs text-slate-400 dark:text-slate-500">{helpText}</p>}
          </div>
          {(showCount || maxLength) && (
            <p className={clsx('text-xs', maxLength && count > maxLength * 0.9 ? 'text-amber-500' : 'text-slate-400')}>
              {count}{maxLength ? `/${maxLength}` : ''}
            </p>
          )}
        </div>
      </div>
    );
  }
);

AdminTextarea.displayName = 'AdminTextarea';
