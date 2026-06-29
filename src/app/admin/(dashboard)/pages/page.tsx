import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminBadge } from '@/components/admin/ui/AdminBadge';
import { Plus, Edit, Trash2, LayoutTemplate } from 'lucide-react';
import { deletePage } from './actions';

export const dynamic = 'force-dynamic';

export default async function PagesPage() {
  const pages = await prisma.page.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { sections: true } } }
  });

  return (
    <div>
      <AdminPageHeader
        title="Pages Builder"
        description="Create and manage dynamic pages with modular sections."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Pages' }]}
        actions={
          <Link href="/admin/pages/new">
            <AdminButton icon={<Plus className="h-4 w-4" />}>New Page</AdminButton>
          </Link>
        }
      />

      <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Page Title</th>
              <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">URL Slug</th>
              <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Sections</th>
              <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Status</th>
              <th className="px-6 py-4 text-right font-semibold text-slate-900 dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {pages.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400">
                      <LayoutTemplate className="h-5 w-5" />
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white">{p.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">/{p.slug}</td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                  <AdminBadge variant="default">{p._count.sections} Sections</AdminBadge>
                </td>
                <td className="px-6 py-4">
                  <AdminBadge variant={p.enabled ? 'success' : 'default'} dot>
                    {p.enabled ? 'Active' : 'Draft'}
                  </AdminBadge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/pages/${p.id}`}>
                      <AdminButton variant="ghost" size="sm" icon={<Edit className="h-3.5 w-3.5" />}>Builder</AdminButton>
                    </Link>
                    {p.slug !== 'home' && (
                      <form action={deletePage.bind(null, p.id)}>
                        <AdminButton variant="ghost" size="sm" type="submit" icon={<Trash2 className="h-3.5 w-3.5" />} className="text-red-500 hover:text-red-600">
                          Delete
                        </AdminButton>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {pages.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  No pages found. Create your first page to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
