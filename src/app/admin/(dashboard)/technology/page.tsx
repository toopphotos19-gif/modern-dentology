import { prisma } from '@/lib/prisma';
import { CrudList } from '@/components/admin/CrudList';
import { deleteTechnology } from '@/lib/adminActions';

export const dynamic = 'force-dynamic';

export default async function AdminTechnology() {
  const rows = await prisma.technology.findMany({ orderBy: { order: 'asc' } });
  return <CrudList title="Technology" basePath="/admin/technology" columns={[{ key: 'name', label: 'Name' }, { key: 'enabled', label: 'Enabled' }]} rows={rows} onDelete={deleteTechnology} />;
}
