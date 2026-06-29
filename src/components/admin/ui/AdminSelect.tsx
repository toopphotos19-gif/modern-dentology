'use client';

import { clsx } from 'clsx';

type Props = {
  label?: string;
  error?: string;
  helpText?: string;
  options: { value: string; label: string }[];
  icon?: React.ReactNode;
  placeholder?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export function AdminSelect({ label, error, helpText, options, icon, className, placeholder, ...props }: Props) {
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
        <select
          {...props}
          className={clsx(
            'w-full rounded-xl border bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 transition-all duration-200 appearance-none',
            'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500',
            error
              ? 'border-red-400'
              : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500',
            icon && 'pl-10',
            className
          )}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <p className="text-xs text-red-500">⚠ {error}</p>}
      {helpText && !error && <p className="text-xs text-slate-400 dark:text-slate-500">{helpText}</p>}
    </div>
  );
}
