import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { PageBuilder } from '@/components/admin/PageBuilder';

export const dynamic = 'force-dynamic';

export default async function EditPage({ params }: { params: { id: string } }) {
  const page = await prisma.page.findUnique({
    where: { id: params.id },
    include: {
      sections: {
        orderBy: { order: 'asc' }
      }
    }
  });

  if (!page) {
    notFound();
  }

  return (
    <div>
      <AdminPageHeader
        title={`Edit: ${page.title}`}
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Pages', href: '/admin/pages' },
          { label: 'Edit' },
        ]}
      />
      <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
        <PageBuilder page={page} initialSections={page.sections} />
      </div>
    </div>
  );
}
