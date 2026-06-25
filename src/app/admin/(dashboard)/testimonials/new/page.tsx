import { CrudForm } from '@/components/admin/CrudForm';
import { saveTestimonial } from '@/lib/adminActions';

const FIELDS = [
  { name: 'patientName', label: 'Patient Name' },
  { name: 'review', label: 'Review', type: 'textarea' as const },
  { name: 'rating', label: 'Rating (1-5)', type: 'number' as const },
  { name: 'videoUrl', label: 'Video URL (optional)' },
  { name: 'beforeImage', label: 'Before Image', type: 'image' as const },
  { name: 'afterImage', label: 'After Image', type: 'image' as const },
  { name: 'order', label: 'Display Order', type: 'number' as const },
  { name: 'enabled', label: 'Enabled', type: 'checkbox' as const }
];

export default function NewTestimonial() {
  return (<div><h1 className="mb-6 text-2xl font-bold text-brand-900">Add Testimonial</h1><CrudForm fields={FIELDS} action={saveTestimonial} redirectTo="/admin/testimonials" /></div>);
}
