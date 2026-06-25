import { prisma } from '@/lib/prisma';
import { CrudList } from '@/components/admin/CrudList';
import { deleteTestimonial } from '@/lib/adminActions';

export const dynamic = 'force-dynamic';

export default async function AdminTestimonials() {
  const rows = await prisma.testimonial.findMany({ orderBy: { order: 'asc' } });
  return <CrudList title="Testimonials" basePath="/admin/testimonials" columns={[{ key: 'patientName', label: 'Patient' }, { key: 'rating', label: 'Rating' }, { key: 'enabled', label: 'Enabled' }]} rows={rows} onDelete={deleteTestimonial} />;
}
