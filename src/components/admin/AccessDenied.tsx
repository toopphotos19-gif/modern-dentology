import { ShieldX } from 'lucide-react';

export function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-500 mb-6">
        <ShieldX className="h-10 w-10" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Access Denied</h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">
        You don&apos;t have permission to access this page. Contact your administrator to request access.
      </p>
      <a
        href="/admin"
        className="rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-brand-600 transition-colors"
      >
        Go to Dashboard
      </a>
    </div>
  );
}
