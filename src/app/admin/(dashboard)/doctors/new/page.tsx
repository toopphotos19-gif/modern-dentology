import { CrudForm } from '@/components/admin/CrudForm';
import { saveDoctor } from '@/lib/adminActions';

const FIELDS = [
  { name: 'name', label: 'Name' },
  { name: 'slug', label: 'URL Slug (optional)' },
  { name: 'qualification', label: 'Qualification' },
  { name: 'experience', label: 'Experience' },
  { name: 'bio', label: 'Biography', type: 'textarea' as const },
  { name: 'specializations', label: 'Specializations (comma separated)' },
  { name: 'photo', label: 'Photo', type: 'image' as const },
  { name: 'order', label: 'Display Order', type: 'number' as const },
  { name: 'enabled', label: 'Enabled', type: 'checkbox' as const }
];

export default function NewDoctor() {
  return (<div><h1 className="mb-6 text-2xl font-bold text-brand-900">Add Doctor</h1><CrudForm fields={FIELDS} action={saveDoctor} redirectTo="/admin/doctors" /></div>);
}
