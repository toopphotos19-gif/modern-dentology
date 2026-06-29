import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminBadge } from '@/components/admin/ui/AdminBadge';
import { Plus, Edit, Trash2, PenTool } from 'lucide-react';
import { deleteBlogPost } from './actions';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <AdminPageHeader
        title="Blog Posts"
        description="Manage your articles, news, and insights."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Blog' }]}
        actions={
          <Link href="/admin/blog/new">
            <AdminButton icon={<Plus className="h-4 w-4" />}>New Post</AdminButton>
          </Link>
        }
      />

      <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Post</th>
              <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Author / Category</th>
              <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Status</th>
              <th className="px-6 py-4 text-right font-semibold text-slate-900 dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {posts.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    {p.featured ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.featured} alt={p.title} className="h-10 w-10 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                        <PenTool className="h-5 w-5 text-slate-400" />
                      </div>
                    )}
                    <div>
                      <span className="block font-medium text-slate-900 dark:text-white">{p.title}</span>
                      <span className="block text-xs text-slate-500 line-clamp-1">{p.excerpt || p.slug}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="block text-slate-900 dark:text-slate-300">{p.author || 'No Author'}</span>
                  <span className="block text-xs text-slate-500">{p.category || 'Uncategorized'}</span>
                </td>
                <td className="px-6 py-4">
                  <AdminBadge variant={p.published ? 'success' : 'default'} dot>{p.published ? 'Published' : 'Draft'}</AdminBadge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/blog/${p.id}`}>
                      <AdminButton variant="ghost" size="sm" icon={<Edit className="h-3.5 w-3.5" />}>Edit</AdminButton>
                    </Link>
                    <form action={deleteBlogPost.bind(null, p.id)}>
                      <AdminButton variant="ghost" size="sm" type="submit" icon={<Trash2 className="h-3.5 w-3.5" />} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">
                        Delete
                      </AdminButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  No blog posts found. Create your first article.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
