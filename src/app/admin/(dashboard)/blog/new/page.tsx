import { CrudForm } from '@/components/admin/CrudForm';
import { saveBlog } from '@/lib/adminActions';

const FIELDS = [
  { name: 'title', label: 'Title' },
  { name: 'slug', label: 'URL Slug (optional)' },
  { name: 'excerpt', label: 'Excerpt' },
  { name: 'content', label: 'Content', type: 'textarea' as const },
  { name: 'featured', label: 'Featured Image', type: 'image' as const },
  { name: 'category', label: 'Category' },
  { name: 'author', label: 'Author' },
  { name: 'metaTitle', label: 'SEO Meta Title' },
  { name: 'metaDesc', label: 'SEO Meta Description' },
  { name: 'published', label: 'Published', type: 'checkbox' as const }
];

export default function NewBlog() {
  return (<div><h1 className="mb-6 text-2xl font-bold text-brand-900">Add Blog Post</h1><CrudForm fields={FIELDS} action={saveBlog} redirectTo="/admin/blog" /></div>);
}
