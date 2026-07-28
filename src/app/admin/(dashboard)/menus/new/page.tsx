import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { MenuForm } from '@/components/admin/MenuForm';

export default async function NewMenuPage() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (role !== 'SUPER_ADMIN') redirect('/admin');

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-800 dark:text-white">Create Menu</h1>
      <MenuForm />
    </div>
  );
}
