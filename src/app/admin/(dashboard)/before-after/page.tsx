import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminBadge } from '@/components/admin/ui/AdminBadge';
import { Plus, SplitSquareVertical, Edit, Trash2 } from 'lucide-react';
import { deleteBeforeAfter } from './actions';

export const dynamic = 'force-dynamic';

export default async function BeforeAfterPage() {
  const [comparisons, categories] = await Promise.all([
    prisma.beforeAfter.findMany({ orderBy: { order: 'asc' }, include: { category: true } }),
    prisma.beforeAfterCategory.findMany({ orderBy: { order: 'asc' } }),
  ]);

  return (
    <div>
      <AdminPageHeader
        title="Before & After Gallery"
        description="Manage treatment comparisons with interactive sliders"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Before & After' }]}
        actions={
          <Link href="/admin/before-after/new">
            <AdminButton icon={<Plus className="h-4 w-4" />}>New Comparison</AdminButton>
          </Link>
        }
      />

      {comparisons.length === 0 ? (
        <div className="rounded-2xl bg-white dark:bg-slate-800 p-12 text-center shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
          <SplitSquareVertical className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">No comparisons yet</h3>
          <p className="mt-2 text-sm text-slate-400 dark:text-slate-500 max-w-sm mx-auto">
            Add before & after photos to showcase treatment results with interactive comparison sliders.
          </p>
          <Link href="/admin/before-after/new" className="mt-4 inline-block">
            <AdminButton icon={<Plus className="h-4 w-4" />}>Add First Comparison</AdminButton>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {comparisons.map((comp) => (
            <div key={comp.id} className="group rounded-2xl bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700 overflow-hidden hover:shadow-lg transition-all duration-300">
              {/* Image Preview */}
              <div className="relative h-48 flex">
                <div className="w-1/2 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {comp.beforeImage && <img src={comp.beforeImage} alt="Before" className="h-full w-full object-cover" />}
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                  <SplitSquareVertical className="h-4 w-4 text-brand-500" />
                </div>
                <div className="w-1/2 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {comp.afterImage && <img src={comp.afterImage} alt="After" className="h-full w-full object-cover" />}
                </div>
              </div>
              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{comp.treatmentName}</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      {comp.category?.name || 'Uncategorized'}
                      {comp.doctorName && ` · ${comp.doctorName}`}
                    </p>
                  </div>
                  <AdminBadge variant={comp.status === 'PUBLISHED' ? 'success' : 'default'} dot>
                    {comp.status}
                  </AdminBadge>
                </div>
                {comp.shortDescription && (
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{comp.shortDescription}</p>
                )}
                <div className="mt-3 flex items-center gap-2">
                  <Link href={`/admin/before-after/${comp.id}`}>
                    <AdminButton variant="ghost" size="sm" icon={<Edit className="h-3.5 w-3.5" />}>Edit</AdminButton>
                  </Link>
                  <form action={deleteBeforeAfter.bind(null, comp.id)}>
                    <AdminButton variant="ghost" size="sm" type="submit" icon={<Trash2 className="h-3.5 w-3.5" />} className="text-red-500 hover:text-red-600">
                      Delete
                    </AdminButton>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
