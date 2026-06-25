import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CrudForm } from '@/components/admin/CrudForm';
import { saveFaq } from '@/lib/adminActions';

export const dynamic = 'force-dynamic';

const FIELDS = [
  { name: 'question', label: 'Question' },
  { name: 'answer', label: 'Answer', type: 'textarea' as const },
  { name: 'order', label: 'Display Order', type: 'number' as const },
  { name: 'enabled', label: 'Enabled', type: 'checkbox' as const }
];

export default async function EditFaq({ params }: { params: { id: string } }) {
  const faq = await prisma.faq.findUnique({ where: { id: params.id } });
  if (!faq) notFound();
  return (<div><h1 className="mb-6 text-2xl font-bold text-brand-900">Edit FAQ</h1><CrudForm fields={FIELDS} action={saveFaq} initial={faq} redirectTo="/admin/faq" /></div>);
}
