import { prisma } from '@/lib/prisma';
import { CrudList } from '@/components/admin/CrudList';
import { deleteBlog } from '@/lib/adminActions';

export const dynamic = 'force-dynamic';

export default async function AdminBlog() {
  const rows = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
  return <CrudList title="Blog" basePath="/admin/blog" columns={[{ key: 'title', label: 'Title' }, { key: 'category', label: 'Category' }, { key: 'published', label: 'Published' }]} rows={rows} onDelete={deleteBlog} />;
}
