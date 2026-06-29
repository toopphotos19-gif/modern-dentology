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

function jsonParse(fd: FormData, key: string) {
  const raw = str(fd, key);
  if (!raw) return undefined;
  try { return JSON.parse(raw); } catch { return undefined; }
}

// Create or update a service from the admin form.
export async function saveService(formData: FormData) {
  const session = await guard();
  const id = str(formData, 'id');
  const name = formData.get('name') as string;
  const benefitsRaw = str(formData, 'benefits');
  const benefits = benefitsRaw ? benefitsRaw.split('\n').map((b) => b.trim()).filter(Boolean) : undefined;

  const data = {
    name,
    slug: str(formData, 'slug') || slugify(name),
    shortDesc: formData.get('shortDesc') as string,
    description: formData.get('description') as string,
    introduction: str(formData, 'introduction'),
    recovery: str(formData, 'recovery'),
    aftercare: str(formData, 'aftercare'),
    image: str(formData, 'image'),
    banner: str(formData, 'banner'),
    downloadPdf: str(formData, 'downloadPdf'),
    categoryId: str(formData, 'categoryId'),
    enabled: formData.get('enabled') === 'on',
    featured: formData.get('featured') === 'on',
    order: Number(formData.get('order') || 0),
    benefits: benefits,
    procedure: jsonParse(formData, 'procedure'),
    faqs: jsonParse(formData, 'faqs'),
    gallery: jsonParse(formData, 'gallery'),
    relatedTreatments: jsonParse(formData, 'relatedTreatments'),
    relatedBlogs: jsonParse(formData, 'relatedBlogs'),
    relatedDoctors: jsonParse(formData, 'relatedDoctors'),
    // SEO
    metaTitle: str(formData, 'metaTitle'),
    metaDesc: str(formData, 'metaDesc'),
    keywords: str(formData, 'keywords'),
    canonicalUrl: str(formData, 'canonicalUrl'),
    robotsMeta: str(formData, 'robotsMeta'),
    focusKeyword: str(formData, 'focusKeyword'),
    ogTitle: str(formData, 'ogTitle'),
    ogDesc: str(formData, 'ogDesc'),
    ogImage: str(formData, 'ogImage'),
    twitterTitle: str(formData, 'twitterTitle'),
    twitterDesc: str(formData, 'twitterDesc'),
    twitterImage: str(formData, 'twitterImage'),
    breadcrumb: str(formData, 'breadcrumb'),
  };

  if (id) await prisma.service.update({ where: { id }, data });
  else await prisma.service.create({ data });

  // Log activity
  try {
    await prisma.activityLog.create({
      data: {
        action: id ? 'updated' : 'created',
        module: 'service',
        entityId: id || undefined,
        entityTitle: name,
        userId: (session.user as { id?: string })?.id || undefined,
      },
    });
  } catch { /* activity log is best-effort */ }

  revalidatePath('/admin/services');
  revalidatePath('/services');
}

export async function deleteService(id: string) {
  await guard();
  const service = await prisma.service.findUnique({ where: { id }, select: { name: true } });
  await prisma.service.delete({ where: { id } });

  try {
    await prisma.activityLog.create({
      data: { action: 'deleted', module: 'service', entityId: id, entityTitle: service?.name },
    });
  } catch { /* best-effort */ }

  revalidatePath('/admin/services');
  revalidatePath('/services');
}
