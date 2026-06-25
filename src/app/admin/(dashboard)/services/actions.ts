'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';
import { auth } from '@/lib/auth';

async function guard() {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');
}

// Create or update a service from the admin form.
export async function saveService(formData: FormData) {
  await guard();
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const data = {
    name,
    slug: (formData.get('slug') as string) || slugify(name),
    shortDesc: formData.get('shortDesc') as string,
    description: formData.get('description') as string,
    image: (formData.get('image') as string) || null,
    banner: (formData.get('banner') as string) || null,
    enabled: formData.get('enabled') === 'on',
    order: Number(formData.get('order') || 0),
    metaTitle: (formData.get('metaTitle') as string) || null,
    metaDesc: (formData.get('metaDesc') as string) || null
  };

  if (id) await prisma.service.update({ where: { id }, data });
  else await prisma.service.create({ data });

  revalidatePath('/admin/services');
  revalidatePath('/services');
}

export async function deleteService(id: string) {
  await guard();
  await prisma.service.delete({ where: { id } });
  revalidatePath('/admin/services');
  revalidatePath('/services');
}
