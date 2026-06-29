'use client';

import { clsx } from 'clsx';
import { formatDistanceToNow } from './utils';

type Activity = {
  id: string;
  action: string;
  module: string;
  entityTitle?: string | null;
  details?: string | null;
  createdAt: string | Date;
  user?: { name?: string | null } | null;
};

const ACTION_COLORS: Record<string, string> = {
  created: 'bg-emerald-500',
  updated: 'bg-blue-500',
  deleted: 'bg-red-500',
  published: 'bg-purple-500',
};

export function ActivityTimeline({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">No recent activity</p>
    );
  }

  return (
    <div className="space-y-0">
      {activities.map((activity, idx) => (
        <div key={activity.id} className="flex gap-3 py-3">
          {/* Timeline dot and line */}
          <div className="flex flex-col items-center">
            <div className={clsx('h-2.5 w-2.5 rounded-full mt-1.5 flex-shrink-0', ACTION_COLORS[activity.action] || 'bg-slate-400')} />
            {idx < activities.length - 1 && <div className="w-px flex-1 bg-slate-200 dark:bg-slate-700 mt-1" />}
          </div>
          {/* Content */}
          <div className="flex-1 min-w-0 pb-2">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <span className="font-medium">{activity.user?.name || 'Admin'}</span>
              {' '}
              <span className="text-slate-500 dark:text-slate-400">{activity.action}</span>
              {' '}
              <span className="font-medium">{activity.module}</span>
              {activity.entityTitle && (
                <>: <span className="text-brand-600 dark:text-brand-400">{activity.entityTitle}</span></>
              )}
            </p>
            {activity.details && (
              <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500 truncate">{activity.details}</p>
            )}
            <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
              {formatDistanceToNow(new Date(activity.createdAt))}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
