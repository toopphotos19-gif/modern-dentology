import { prisma } from '@/lib/prisma';
import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { SettingsForm } from '@/components/admin/SettingsForm';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  // Fetch existing settings or return an empty object
  const settings = await prisma.siteSetting.findUnique({ where: { id: 'main' } }) || {};

  return (
    <div>
      <AdminPageHeader
        title="Global Website Settings"
        description="Manage your website's global content, appearance, and integrations."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Settings' }]}
      />

      <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
