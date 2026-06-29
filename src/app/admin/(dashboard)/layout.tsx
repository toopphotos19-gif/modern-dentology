import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { auth } from '@/lib/auth';
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient';

// Guard ONLY the protected dashboard pages. /admin/login is outside this group
// so it is never guarded (prevents the redirect loop).
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect('/admin/login');

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-x-hidden">
        <AdminLayoutClient>{children}</AdminLayoutClient>
      </div>
    </div>
  );
}
