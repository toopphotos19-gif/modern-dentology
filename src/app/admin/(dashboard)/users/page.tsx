import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { UserList } from '@/components/admin/UserList';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (role !== 'SUPER_ADMIN') redirect('/admin');

  const [users, menus] = await Promise.all([
    prisma.user.findMany({
      include: { menu: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.adminMenu.findMany({ select: { id: true, name: true } }),
  ]);

  return (
    <div>
      <UserList users={users as any} menus={menus} />
    </div>
  );
}
