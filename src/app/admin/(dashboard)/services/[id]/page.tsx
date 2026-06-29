import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ServiceForm } from '@/components/admin/ServiceForm';

export const dynamic = 'force-dynamic';

export default async function EditService({ params }: { params: { id: string } }) {
  const [service, categories] = await Promise.all([
    prisma.service.findUnique({ where: { id: params.id } }),
    prisma.serviceCategory.findMany()
  ]);
  
  if (!service) notFound();
  
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-900">Edit Service</h1>
      <ServiceForm service={service} categories={categories} />
    </div>
  );
}
