import { prisma } from '@/lib/prisma';
import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { AboutPageForm } from '@/components/admin/AboutPageForm';

export const dynamic = 'force-dynamic';

export default async function AboutAdminPage() {
  const page = await prisma.aboutPage.findUnique({ where: { id: 'main' } }) || {};

  return (
    <div>
      <AdminPageHeader
        title="About Page Content"
        description="Manage your clinic's story, team, clinic images, and statistics."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'About Page' }]}
      />

      <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
        <AboutPageForm page={page} />
      </div>
    </div>
  );
}
