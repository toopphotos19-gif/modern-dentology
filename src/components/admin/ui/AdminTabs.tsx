'use client';

import * as Tabs from '@radix-ui/react-tabs';
import { clsx } from 'clsx';

export function AdminTabs({
  tabs,
  defaultValue,
  className,
}: {
  tabs: { value: string; label: string; icon?: React.ReactNode; content: React.ReactNode; badge?: string }[];
  defaultValue?: string;
  className?: string;
}) {
  return (
    <Tabs.Root defaultValue={defaultValue || tabs[0]?.value} className={className}>
      <Tabs.List className="flex gap-1 border-b border-slate-200 dark:border-slate-700 mb-6 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => (
          <Tabs.Trigger
            key={tab.value}
            value={tab.value}
            className={clsx(
              'flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200',
              'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200',
              'border-b-2 border-transparent -mb-px',
              'data-[state=active]:text-brand-600 dark:data-[state=active]:text-brand-400',
              'data-[state=active]:border-brand-500',
              'focus:outline-none'
            )}
          >
            {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
            {tab.label}
            {tab.badge && (
              <span className="ml-1 rounded-full bg-brand-100 dark:bg-brand-900/30 px-2 py-0.5 text-[10px] font-bold text-brand-600 dark:text-brand-400">
                {tab.badge}
              </span>
            )}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {tabs.map((tab) => (
        <Tabs.Content
          key={tab.value}
          value={tab.value}
          forceMount
          className="focus:outline-none data-[state=inactive]:hidden"
        >
          {tab.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
