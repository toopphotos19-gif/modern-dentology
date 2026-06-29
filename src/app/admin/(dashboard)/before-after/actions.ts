'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';
import { auth } from '@/lib/auth';

async function guard() {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');
  return session;
}

function str(fd: FormData, key: string): string | null {
  const v = fd.get(key);
  return typeof v === 'string' && v.length ? v : null;
}

export async function saveBeforeAfter(fd: FormData) {
  const session = await guard();
  const id = str(fd, 'id');
  const treatmentName = fd.get('treatmentName') as string;

  const data = {
    treatmentName,
    slug: str(fd, 'slug') || slugify(treatmentName + '-' + Date.now().toString(36).slice(-4)),
    patientName: str(fd, 'patientName'),
    patientInitials: str(fd, 'patientInitials'),
    categoryId: str(fd, 'categoryId'),
    doctorName: str(fd, 'doctorName'),
    treatmentDate: str(fd, 'treatmentDate') ? new Date(fd.get('treatmentDate') as string) : null,
    status: (fd.get('status') as 'DRAFT' | 'PUBLISHED') || 'DRAFT',
    featured: fd.get('featured') === 'on',
    order: Number(fd.get('order') || 0),
    // Images
    beforeImage: fd.get('beforeImage') as string,
    afterImage: fd.get('afterImage') as string,
    beforeImageAlt: str(fd, 'beforeImageAlt'),
    afterImageAlt: str(fd, 'afterImageAlt'),
    beforeImageCaption: str(fd, 'beforeImageCaption'),
    afterImageCaption: str(fd, 'afterImageCaption'),
    // Content
    shortDescription: str(fd, 'shortDescription'),
    patientStory: str(fd, 'patientStory'),
    treatmentSummary: str(fd, 'treatmentSummary'),
    procedurePerformed: str(fd, 'procedurePerformed'),
    // SEO
    seoTitle: str(fd, 'seoTitle'),
    seoDesc: str(fd, 'seoDesc'),
    seoKeywords: str(fd, 'seoKeywords'),
    ogImage: str(fd, 'ogImage'),
    focusKeyword: str(fd, 'focusKeyword'),
  };

  if (id) await prisma.beforeAfter.update({ where: { id }, data });
  else await prisma.beforeAfter.create({ data });

  try {
    await prisma.activityLog.create({
      data: {
        action: id ? 'updated' : 'created',
        module: 'before-after',
        entityTitle: treatmentName,
        userId: (session.user as { id?: string })?.id || undefined,
      },
    });
  } catch { /* best-effort */ }

  revalidatePath('/admin/before-after');
  revalidatePath('/before-after');
}

export async function deleteBeforeAfter(id: string) {
  await guard();
  await prisma.beforeAfter.delete({ where: { id } });
  revalidatePath('/admin/before-after');
  revalidatePath('/before-after');
}

export async function saveBeforeAfterCategory(fd: FormData) {
  await guard();
  const id = str(fd, 'id');
  const name = fd.get('name') as string;
  const data = {
    name,
    slug: str(fd, 'slug') || slugify(name),
    order: Number(fd.get('order') || 0),
    enabled: fd.get('enabled') === 'on',
  };
  if (id) await prisma.beforeAfterCategory.update({ where: { id }, data });
  else await prisma.beforeAfterCategory.create({ data });
  revalidatePath('/admin/before-after');
}

export async function deleteBeforeAfterCategory(id: string) {
  await guard();
  await prisma.beforeAfterCategory.delete({ where: { id } });
  revalidatePath('/admin/before-after');
}
