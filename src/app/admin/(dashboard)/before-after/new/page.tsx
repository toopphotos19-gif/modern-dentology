import { BeforeAfterForm } from '@/components/admin/BeforeAfterForm';
import { prisma } from '@/lib/prisma';
import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';

export const dynamic = 'force-dynamic';

export default async function NewBeforeAfterPage() {
  const categories = await prisma.beforeAfterCategory.findMany({ where: { enabled: true }, orderBy: { order: 'asc' } });
  
  return (
    <div>
      <AdminPageHeader
        title="New Comparison"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Before & After', href: '/admin/before-after' },
          { label: 'New' },
        ]}
      />
      <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
        <BeforeAfterForm categories={categories} />
      </div>
    </div>
  );
}
