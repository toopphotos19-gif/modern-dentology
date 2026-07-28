import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { UserForm } from '@/components/admin/UserForm';

export const dynamic = 'force-dynamic';

export default async function EditUserPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (role !== 'SUPER_ADMIN') redirect('/admin');

  const [user, menus] = await Promise.all([
    prisma.user.findUnique({ where: { id: params.id } }),
    prisma.adminMenu.findMany({ select: { id: true, name: true } }),
  ]);

  if (!user) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-800 dark:text-white">Edit User</h1>
      <UserForm user={user as any} menus={menus} />
    </div>
  );
}
