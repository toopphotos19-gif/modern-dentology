import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CrudForm } from '@/components/admin/CrudForm';
import { saveTechnology } from '@/lib/adminActions';

export const dynamic = 'force-dynamic';

const FIELDS = [
  { name: 'name', label: 'Name' },
  { name: 'slug', label: 'URL Slug (optional)' },
  { name: 'shortDesc', label: 'Short Description' },
  { name: 'description', label: 'Full Description', type: 'textarea' as const },
  { name: 'image', label: 'Image', type: 'image' as const },
  { name: 'order', label: 'Display Order', type: 'number' as const },
  { name: 'enabled', label: 'Enabled', type: 'checkbox' as const }
];

export default async function EditTech({ params }: { params: { id: string } }) {
  const tech = await prisma.technology.findUnique({ where: { id: params.id } });
  if (!tech) notFound();
  return (<div><h1 className="mb-6 text-2xl font-bold text-brand-900">Edit Technology</h1><CrudForm fields={FIELDS} action={saveTechnology} initial={tech} redirectTo="/admin/technology" /></div>);
}
