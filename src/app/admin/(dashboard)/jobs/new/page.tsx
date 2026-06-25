import { CrudForm } from '@/components/admin/CrudForm';
import { saveJob } from '@/lib/adminActions';

const FIELDS = [
  { name: 'title', label: 'Job Title' },
  { name: 'slug', label: 'URL Slug (optional)' },
  { name: 'description', label: 'Description', type: 'textarea' as const },
  { name: 'location', label: 'Location' },
  { name: 'type', label: 'Type (Full-time/Part-time)' },
  { name: 'enabled', label: 'Open / Enabled', type: 'checkbox' as const }
];

export default function NewJob() {
  return (<div><h1 className="mb-6 text-2xl font-bold text-brand-900">Add Job Opening</h1><CrudForm fields={FIELDS} action={saveJob} redirectTo="/admin/jobs" /></div>);
}
