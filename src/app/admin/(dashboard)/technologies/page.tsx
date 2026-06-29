import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminBadge } from '@/components/admin/ui/AdminBadge';
import { Plus, Edit, Trash2, Cpu } from 'lucide-react';
import { deleteTechnology } from './actions';

export const dynamic = 'force-dynamic';

export default async function TechnologiesPage() {
  const technologies = await prisma.technology.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div>
      <AdminPageHeader
        title="Technologies"
        description="Manage the clinic's advanced dental technologies and equipment."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Technologies' }]}
        actions={
          <Link href="/admin/technologies/new">
            <AdminButton icon={<Plus className="h-4 w-4" />}>Add Technology</AdminButton>
          </Link>
        }
      />

      <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Technology</th>
              <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Manufacturer</th>
              <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Status</th>
              <th className="px-6 py-4 text-right font-semibold text-slate-900 dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {technologies.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    {t.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.image} alt={t.name} className="h-10 w-10 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                        <Cpu className="h-5 w-5 text-slate-400" />
                      </div>
                    )}
                    <div>
                      <span className="block font-medium text-slate-900 dark:text-white">{t.name}</span>
                      <span className="block text-xs text-slate-500 line-clamp-1">{t.shortDesc}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{t.manufacturer || '-'}</td>
                <td className="px-6 py-4">
                  <AdminBadge variant={t.enabled ? 'success' : 'default'} dot>{t.enabled ? 'Active' : 'Draft'}</AdminBadge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/technologies/${t.id}`}>
                      <AdminButton variant="ghost" size="sm" icon={<Edit className="h-3.5 w-3.5" />}>Edit</AdminButton>
                    </Link>
                    <form action={deleteTechnology.bind(null, t.id)}>
                      <AdminButton variant="ghost" size="sm" type="submit" icon={<Trash2 className="h-3.5 w-3.5" />} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                        Delete
                      </AdminButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {technologies.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  No technologies found. Add your first technology.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
