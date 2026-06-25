import { prisma } from '@/lib/prisma';
import { CrudList } from '@/components/admin/CrudList';
import { deleteJob } from '@/lib/adminActions';

export const dynamic = 'force-dynamic';

export default async function AdminJobs() {
  const rows = await prisma.job.findMany({ orderBy: { createdAt: 'desc' } });
  return <CrudList title="Job Openings" basePath="/admin/jobs" columns={[{ key: 'title', label: 'Title' }, { key: 'location', label: 'Location' }, { key: 'enabled', label: 'Enabled' }]} rows={rows} onDelete={deleteJob} />;
}
