import { prisma } from '@/lib/prisma';
import { CrudList } from '@/components/admin/CrudList';
import { deleteDoctor } from '@/lib/adminActions';

export const dynamic = 'force-dynamic';

export default async function AdminDoctors() {
  const rows = await prisma.doctor.findMany({ orderBy: { order: 'asc' } });
  return <CrudList title="Doctors" basePath="/admin/doctors" columns={[{ key: 'name', label: 'Name' }, { key: 'qualification', label: 'Qualification' }, { key: 'enabled', label: 'Enabled' }]} rows={rows} onDelete={deleteDoctor} />;
}
