import { ServiceForm } from '@/components/admin/ServiceForm';

export default function NewService() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-900">Add Service</h1>
      <ServiceForm />
    </div>
  );
}
