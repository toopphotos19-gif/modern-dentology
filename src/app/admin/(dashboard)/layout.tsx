import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient';

// Guard ONLY the protected dashboard pages. /admin/login is outside this group
// so it is never guarded (prevents the redirect loop).
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect('/admin/login');

  const user = session.user as any;
  const userRole = user?.role || 'STAFF';
  const userId = user?.id;

  // Fetch user's menu items if not SUPER_ADMIN
  let menuItems: { label: string; href: string; icon: string | null; group: string }[] = [];
  let allowedPaths: string[] = [];

  if (userRole === 'SUPER_ADMIN') {
    // Super admins can access everything
    allowedPaths = ['*'];
  } else {
    // Fetch user with menu items
    const dbUser = userId
      ? await prisma.user.findUnique({
          where: { id: userId },
          include: { menu: { include: { items: { orderBy: { order: 'asc' } } } } },
        })
      : null;

    if (dbUser?.menu?.items) {
      menuItems = dbUser.menu.items.map((item) => ({
        label: item.label,
        href: item.href,
        icon: item.icon,
        group: item.group,
      }));
      allowedPaths = menuItems.map((item) => item.href);
    }

    // Always allow the main dashboard
    if (!allowedPaths.includes('/admin')) {
      allowedPaths.push('/admin');
    }
  }


  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <AdminSidebar
        userRole={userRole}
        userName={user?.name}
        userEmail={user?.email}
        menuItems={menuItems}
      />
      <div className="flex-1 flex flex-col overflow-x-hidden">
        <AdminLayoutClient
          allowedPaths={allowedPaths}
          userRole={userRole}
        >
          {children}
        </AdminLayoutClient>
      </div>
    </div>
  );
}
