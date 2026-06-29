import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminBadge } from '@/components/admin/ui/AdminBadge';
import { Plus, Edit, Trash2, Star, MessageSquare } from 'lucide-react';
import { deleteTestimonial } from './actions';

export const dynamic = 'force-dynamic';

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: [{ featured: 'desc' }, { order: 'asc' }],
  });

  return (
    <div>
      <AdminPageHeader
        title="Testimonials"
        description="Manage patient reviews, ratings, and video testimonials."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Testimonials' }]}
        actions={
          <Link href="/admin/testimonials/new">
            <AdminButton icon={<Plus className="h-4 w-4" />}>New Testimonial</AdminButton>
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <div key={t.id} className="group rounded-2xl bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700 overflow-hidden flex flex-col">
            <div className="p-5 flex-1">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {t.patientImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.patientImage} alt={t.patientName} className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                      {t.patientName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white leading-tight">{t.patientName}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.treatment || t.patientLocation || 'Patient'}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <AdminBadge variant={t.enabled ? 'success' : 'default'} dot>{t.enabled ? 'Active' : 'Draft'}</AdminBadge>
                  {t.featured && <AdminBadge variant="warning">Featured</AdminBadge>}
                </div>
              </div>

              <div className="mt-4 flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < t.rating ? 'fill-current' : 'text-slate-200 dark:text-slate-700'}`} />
                ))}
              </div>

              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
                &ldquo;{t.review}&rdquo;
              </p>
            </div>
            
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-5 py-3">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                {(t.videoUrl || t.videoReview) && (
                  <span className="flex items-center gap-1 rounded-md bg-blue-50 text-blue-600 px-2 py-1 dark:bg-blue-500/10 dark:text-blue-400">
                    Video
                  </span>
                )}
                {(t.beforeImage && t.afterImage) && (
                  <span className="flex items-center gap-1 rounded-md bg-emerald-50 text-emerald-600 px-2 py-1 dark:bg-emerald-500/10 dark:text-emerald-400">
                    B&A
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/testimonials/${t.id}`}>
                  <AdminButton variant="ghost" size="sm" icon={<Edit className="h-3.5 w-3.5" />}>Edit</AdminButton>
                </Link>
                <form action={deleteTestimonial.bind(null, t.id)}>
                  <AdminButton variant="ghost" size="sm" type="submit" icon={<Trash2 className="h-3.5 w-3.5" />} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">
                    Delete
                  </AdminButton>
                </form>
              </div>
            </div>
          </div>
        ))}
        {testimonials.length === 0 && (
          <div className="col-span-full rounded-2xl bg-white dark:bg-slate-800 p-12 text-center shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
            <MessageSquare className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">No testimonials yet</h3>
            <p className="mt-2 text-sm text-slate-400 dark:text-slate-500 max-w-sm mx-auto">
              Add patient reviews, ratings, and video testimonials to build trust.
            </p>
            <Link href="/admin/testimonials/new" className="mt-4 inline-block">
              <AdminButton icon={<Plus className="h-4 w-4" />}>Add First Testimonial</AdminButton>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
