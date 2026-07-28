import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { UserForm } from '@/components/admin/UserForm';

export default async function NewUserPage() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (role !== 'SUPER_ADMIN') redirect('/admin');

  const menus = await prisma.adminMenu.findMany({ select: { id: true, name: true } });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-800 dark:text-white">Add User</h1>
      <UserForm menus={menus} />
    </div>
  );
}
