import { prisma } from '@/lib/prisma';
import { SettingsForm } from '@/components/admin/SettingsForm';

export const dynamic = 'force-dynamic';

export default async function AdminSettings() {
  const settings = await prisma.siteSetting.findUnique({ where: { id: 'main' } });
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-900">Site & Homepage Settings</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}
