import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { TestimonialForm } from '@/components/admin/TestimonialForm';

export const dynamic = 'force-dynamic';

export default function NewTestimonialPage() {
  return (
    <div>
      <AdminPageHeader
        title="New Testimonial"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Testimonials', href: '/admin/testimonials' },
          { label: 'New' },
        ]}
      />
      <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
        <TestimonialForm />
      </div>
    </div>
  );
}
