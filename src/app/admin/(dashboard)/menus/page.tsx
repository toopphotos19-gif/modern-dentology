import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { MenuList } from '@/components/admin/MenuList';

export const dynamic = 'force-dynamic';

export default async function MenusPage() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (role !== 'SUPER_ADMIN') redirect('/admin');

  const menus = await prisma.adminMenu.findMany({
    include: {
      items: { orderBy: { order: 'asc' } },
      _count: { select: { users: true } },
    },
    orderBy: { createdAt: 'asc' },
  });

  return (
    <div>
      <MenuList menus={menus as any} />
    </div>
  );
}
