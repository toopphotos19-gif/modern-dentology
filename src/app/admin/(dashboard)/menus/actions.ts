'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

async function guardSuperAdmin() {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');
  const role = (session.user as any)?.role;
  if (role !== 'SUPER_ADMIN') throw new Error('Only Super Admins can manage menus');
  return session;
}

export type MenuItemInput = {
  label: string;
  href: string;
  icon: string;
  group: string;
  order: number;
};

export async function saveMenu(formData: FormData) {
  await guardSuperAdmin();

  const id = formData.get('id') as string | null;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string | null;
  const itemsRaw = formData.get('items') as string;

  if (!name) throw new Error('Menu name is required');

  let items: MenuItemInput[] = [];
  try {
    items = JSON.parse(itemsRaw || '[]');
  } catch {
    throw new Error('Invalid menu items data');
  }

  // Check for duplicate name
  const existing = await prisma.adminMenu.findUnique({ where: { name } });
  if (existing && existing.id !== id) throw new Error('A menu with this name already exists');

  if (id) {
    // Update: remove old items and create new ones
    await prisma.adminMenuItem.deleteMany({ where: { menuId: id } });
    await prisma.adminMenu.update({
      where: { id },
      data: {
        name,
        description,
        items: {
          create: items.map((item, i) => ({
            label: item.label,
            href: item.href,
            icon: item.icon || null,
            group: item.group || 'Content',
            order: item.order ?? i,
          })),
        },
      },
    });
  } else {
    await prisma.adminMenu.create({
      data: {
        name,
        description,
        items: {
          create: items.map((item, i) => ({
            label: item.label,
            href: item.href,
            icon: item.icon || null,
            group: item.group || 'Content',
            order: item.order ?? i,
          })),
        },
      },
    });
  }

  revalidatePath('/admin/menus');
}

export async function deleteMenu(id: string) {
  await guardSuperAdmin();

  // Check if any users are assigned to this menu
  const usersCount = await prisma.user.count({ where: { menuId: id } });
  if (usersCount > 0) {
    throw new Error(`Cannot delete: ${usersCount} user(s) are still assigned to this menu. Reassign them first.`);
  }

  await prisma.adminMenu.delete({ where: { id } });

  revalidatePath('/admin/menus');
}
