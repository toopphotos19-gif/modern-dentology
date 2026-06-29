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

export async function saveTechnology(fd: FormData) {
  const session = await guard();
  const id = str(fd, 'id');
  const name = fd.get('name') as string;

  const data = {
    name,
    slug: str(fd, 'slug') || slugify(name),
    manufacturer: str(fd, 'manufacturer'),
    shortDesc: fd.get('shortDesc') as string,
    description: fd.get('description') as string,
    image: str(fd, 'image'),
    
    // JSON arrays
    benefits: fd.get('benefits') ? (fd.get('benefits') as string).split('\n').filter(Boolean) : [],
    features: jsonParse(fd, 'features'),
    videos: jsonParse(fd, 'videos'),
    gallery: jsonParse(fd, 'gallery'),
    relatedTreatments: jsonParse(fd, 'relatedTreatments'),
    relatedDoctors: jsonParse(fd, 'relatedDoctors'),
    comparisonTable: jsonParse(fd, 'comparisonTable'),
    
    enabled: fd.get('enabled') === 'on',
    order: Number(fd.get('order') || 0),
    
    // SEO
    metaTitle: str(fd, 'metaTitle'),
    metaDesc: str(fd, 'metaDesc'),
    keywords: str(fd, 'keywords'),
    canonicalUrl: str(fd, 'canonicalUrl'),
    robotsMeta: str(fd, 'robotsMeta'),
    focusKeyword: str(fd, 'focusKeyword'),
    ogTitle: str(fd, 'ogTitle'),
    ogDesc: str(fd, 'ogDesc'),
    ogImage: str(fd, 'ogImage'),
    twitterTitle: str(fd, 'twitterTitle'),
    twitterDesc: str(fd, 'twitterDesc'),
    twitterImage: str(fd, 'twitterImage'),
    breadcrumb: str(fd, 'breadcrumb'),
  };

  if (id) await prisma.technology.update({ where: { id }, data });
  else await prisma.technology.create({ data });

  try {
    await prisma.activityLog.create({
      data: {
        action: id ? 'updated' : 'created',
        module: 'technology',
        entityTitle: name,
        userId: (session.user as { id?: string })?.id || undefined,
      },
    });
  } catch { /* best-effort */ }

  revalidatePath('/admin/technologies');
  revalidatePath('/technologies');
}

export async function deleteTechnology(id: string) {
  await guard();
  await prisma.technology.delete({ where: { id } });
  revalidatePath('/admin/technologies');
  revalidatePath('/technologies');
}
