import { CrudForm } from '@/components/admin/CrudForm';
import { saveTechnology } from '@/lib/adminActions';

const FIELDS = [
  { name: 'name', label: 'Name' },
  { name: 'slug', label: 'URL Slug (optional)' },
  { name: 'shortDesc', label: 'Short Description' },
  { name: 'description', label: 'Full Description', type: 'textarea' as const },
  { name: 'image', label: 'Image', type: 'image' as const },
  { name: 'order', label: 'Display Order', type: 'number' as const },
  { name: 'enabled', label: 'Enabled', type: 'checkbox' as const }
];

export default function NewTech() {
  return (<div><h1 className="mb-6 text-2xl font-bold text-brand-900">Add Technology</h1><CrudForm fields={FIELDS} action={saveTechnology} redirectTo="/admin/technology" /></div>);
}
