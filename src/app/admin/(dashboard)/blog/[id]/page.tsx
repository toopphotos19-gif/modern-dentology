import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { BlogForm } from '@/components/admin/BlogForm';

export const dynamic = 'force-dynamic';

export default async function EditBlogPage({ params }: { params: { id: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!post) notFound();

  return (
    <div>
      <AdminPageHeader
        title={`Edit: ${post.title}`}
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Blog', href: '/admin/blog' },
          { label: 'Edit' },
        ]}
      />
      <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
        <BlogForm post={post} />
      </div>
    </div>
  );
}
