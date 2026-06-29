import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { PageBuilder } from '@/components/admin/PageBuilder';

export const dynamic = 'force-dynamic';

export default function NewPage() {
  return (
    <div>
      <AdminPageHeader
        title="Create Page"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Pages', href: '/admin/pages' },
          { label: 'New' },
        ]}
      />
      <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
        <PageBuilder />
      </div>
    </div>
  );
}
