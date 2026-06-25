import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CrudForm } from '@/components/admin/CrudForm';
import { saveBlog } from '@/lib/adminActions';

export const dynamic = 'force-dynamic';

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

export default async function EditBlog({ params }: { params: { id: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!post) notFound();
  return (<div><h1 className="mb-6 text-2xl font-bold text-brand-900">Edit Blog Post</h1><CrudForm fields={FIELDS} action={saveBlog} initial={post} redirectTo="/admin/blog" /></div>);
}
