import { prisma } from '@/lib/prisma';
import { CrudList } from '@/components/admin/CrudList';
import { deleteFaq } from '@/lib/adminActions';

export const dynamic = 'force-dynamic';

export default async function AdminFaq() {
  const rows = await prisma.faq.findMany({ orderBy: { order: 'asc' } });
  return <CrudList title="FAQ" basePath="/admin/faq" columns={[{ key: 'question', label: 'Question' }, { key: 'enabled', label: 'Enabled' }]} rows={rows} onDelete={deleteFaq} />;
}
