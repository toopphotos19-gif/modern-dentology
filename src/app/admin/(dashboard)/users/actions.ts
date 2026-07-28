'use server';

import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

async function guardSuperAdmin() {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');
  const role = (session.user as any)?.role;
  if (role !== 'SUPER_ADMIN') throw new Error('Only Super Admins can manage users');
  return session;
}

export async function createUser(formData: FormData) {
  await guardSuperAdmin();

  const email = formData.get('email') as string;
  const name = formData.get('name') as string || null;
  const password = formData.get('password') as string;
  const role = (formData.get('role') as string) || 'STAFF';
  const menuId = formData.get('menuId') as string || null;
  const enabled = formData.get('enabled') === 'on';

  if (!email || !password) throw new Error('Email and password are required');

  // Check if email already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('A user with this email already exists');

  const hashed = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      email,
      name,
      password: hashed,
      role: role as any,
      menuId: menuId || null,
      enabled,
    },
  });

  revalidatePath('/admin/users');
}

export async function updateUser(formData: FormData) {
  await guardSuperAdmin();

  const id = formData.get('id') as string;
  const email = formData.get('email') as string;
  const name = formData.get('name') as string || null;
  const password = formData.get('password') as string;
  const role = (formData.get('role') as string) || 'STAFF';
  const menuId = formData.get('menuId') as string || null;
  const enabled = formData.get('enabled') === 'on';

  if (!id || !email) throw new Error('Missing required fields');

  // Check duplicate email
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && existing.id !== id) throw new Error('Another user with this email already exists');

  const data: any = {
    email,
    name,
    role: role as any,
    menuId: menuId || null,
    enabled,
  };

  // Only update password if a new one was provided
  if (password && password.length > 0) {
    data.password = await bcrypt.hash(password, 12);
  }

  await prisma.user.update({ where: { id }, data });

  revalidatePath('/admin/users');
}

export async function deleteUser(id: string) {
  await guardSuperAdmin();

  // Prevent deleting the last SUPER_ADMIN
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error('User not found');

  if (user.role === 'SUPER_ADMIN') {
    const superAdminCount = await prisma.user.count({ where: { role: 'SUPER_ADMIN' } });
    if (superAdminCount <= 1) throw new Error('Cannot delete the last Super Admin');
  }

  await prisma.user.delete({ where: { id } });

  revalidatePath('/admin/users');
}

export async function toggleUserEnabled(id: string, enabled: boolean) {
  await guardSuperAdmin();

  // Prevent disabling the last SUPER_ADMIN
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error('User not found');

  if (!enabled && user.role === 'SUPER_ADMIN') {
    const activeSuperAdmins = await prisma.user.count({ where: { role: 'SUPER_ADMIN', enabled: true } });
    if (activeSuperAdmins <= 1) throw new Error('Cannot disable the last active Super Admin');
  }

  await prisma.user.update({ where: { id }, data: { enabled } });

  revalidatePath('/admin/users');
}
