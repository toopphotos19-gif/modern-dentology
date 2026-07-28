import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { MenuForm } from '@/components/admin/MenuForm';

export const dynamic = 'force-dynamic';

export default async function EditMenuPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (role !== 'SUPER_ADMIN') redirect('/admin');

  const menu = await prisma.adminMenu.findUnique({
    where: { id: params.id },
    include: { items: { orderBy: { order: 'asc' } } },
  });

  if (!menu) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-800 dark:text-white">Edit Menu</h1>
      <MenuForm menu={menu as any} />
    </div>
  );
}
