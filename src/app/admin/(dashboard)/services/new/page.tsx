import { prisma } from '@/lib/prisma';
import { ServiceForm } from '@/components/admin/ServiceForm';

export default async function NewService() {
  const [categories, services, blogs, doctors] = await Promise.all([
    prisma.serviceCategory.findMany(),
    prisma.service.findMany({ select: { id: true, name: true } }),
    prisma.blogPost.findMany({ select: { id: true, title: true } }),
    prisma.doctor.findMany({ select: { id: true, name: true } }),
  ]);
  
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-900">Add Service</h1>
      <ServiceForm
        categories={categories}
        allServices={services.map((s) => ({ id: s.id, name: s.name }))}
        allBlogs={blogs.map((b) => ({ id: b.id, name: b.title }))}
        allDoctors={doctors.map((d) => ({ id: d.id, name: d.name }))}
      />
    </div>
  );
}

