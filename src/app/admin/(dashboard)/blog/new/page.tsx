import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { BlogForm } from '@/components/admin/BlogForm';

export const dynamic = 'force-dynamic';

export default function NewBlogPage() {
  return (
    <div>
      <AdminPageHeader
        title="Create Post"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Blog', href: '/admin/blog' },
          { label: 'New' },
        ]}
      />
      <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
        <BlogForm />
      </div>
    </div>
  );
}
