import { prisma } from '@/lib/prisma';
import { ServiceForm } from '@/components/admin/ServiceForm';

export default async function NewService() {
  const categories = await prisma.serviceCategory.findMany();
  
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-900">Add Service</h1>
      <ServiceForm categories={categories} />
    </div>
  );
}
