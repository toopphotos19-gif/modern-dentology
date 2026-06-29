import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { TestimonialForm } from '@/components/admin/TestimonialForm';

export const dynamic = 'force-dynamic';

export default async function EditTestimonialPage({ params }: { params: { id: string } }) {
  const testimonial = await prisma.testimonial.findUnique({ where: { id: params.id } });
  if (!testimonial) notFound();

  return (
    <div>
      <AdminPageHeader
        title={`Edit: ${testimonial.patientName}`}
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Testimonials', href: '/admin/testimonials' },
          { label: 'Edit' },
        ]}
      />
      <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
        <TestimonialForm testimonial={testimonial} />
      </div>
    </div>
  );
}
