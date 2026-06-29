import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { TechnologyForm } from '@/components/admin/TechnologyForm';

export const dynamic = 'force-dynamic';

export default async function EditTechnologyPage({ params }: { params: { id: string } }) {
  const technology = await prisma.technology.findUnique({ where: { id: params.id } });
  if (!technology) notFound();

  return (
    <div>
      <AdminPageHeader
        title={`Edit: ${technology.name}`}
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Technologies', href: '/admin/technologies' },
          { label: 'Edit' },
        ]}
      />
      <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
        <TechnologyForm technology={technology} />
      </div>
    </div>
  );
}
