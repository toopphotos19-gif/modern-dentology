import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { TechnologyForm } from '@/components/admin/TechnologyForm';

export const dynamic = 'force-dynamic';

export default function NewTechnologyPage() {
  return (
    <div>
      <AdminPageHeader
        title="Add Technology"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Technologies', href: '/admin/technologies' },
          { label: 'New' },
        ]}
      />
      <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
        <TechnologyForm />
      </div>
    </div>
  );
}
