import { CrudForm } from '@/components/admin/CrudForm';
import { saveFaq } from '@/lib/adminActions';

const FIELDS = [
  { name: 'question', label: 'Question' },
  { name: 'answer', label: 'Answer', type: 'textarea' as const },
  { name: 'order', label: 'Display Order', type: 'number' as const },
  { name: 'enabled', label: 'Enabled', type: 'checkbox' as const }
];

export default function NewFaq() {
  return (<div><h1 className="mb-6 text-2xl font-bold text-brand-900">Add FAQ</h1><CrudForm fields={FIELDS} action={saveFaq} redirectTo="/admin/faq" /></div>);
}
