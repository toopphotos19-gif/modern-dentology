import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CrudForm } from '@/components/admin/CrudForm';
import { saveJob } from '@/lib/adminActions';

export const dynamic = 'force-dynamic';

const FIELDS = [
  { name: 'title', label: 'Job Title' },
  { name: 'slug', label: 'URL Slug (optional)' },
  { name: 'description', label: 'Description', type: 'textarea' as const },
  { name: 'location', label: 'Location' },
  { name: 'type', label: 'Type (Full-time/Part-time)' },
  { name: 'enabled', label: 'Open / Enabled', type: 'checkbox' as const }
];

export default async function EditJob({ params }: { params: { id: string } }) {
  const job = await prisma.job.findUnique({ where: { id: params.id } });
  if (!job) notFound();
  return (<div><h1 className="mb-6 text-2xl font-bold text-brand-900">Edit Job Opening</h1><CrudForm fields={FIELDS} action={saveJob} initial={job} redirectTo="/admin/jobs" /></div>);
}
