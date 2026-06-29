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

export async function saveTestimonial(fd: FormData) {
  const session = await guard();
  const id = str(fd, 'id');
  const patientName = fd.get('patientName') as string;

  const data = {
    patientName,
    slug: str(fd, 'slug') || slugify(patientName + '-' + Date.now().toString(36).slice(-4)),
    patientImage: str(fd, 'patientImage'),
    patientLocation: str(fd, 'patientLocation'),
    treatment: str(fd, 'treatment'),
    rating: Number(fd.get('rating') || 5),
    review: fd.get('review') as string,
    videoUrl: str(fd, 'videoUrl'),
    videoReview: str(fd, 'videoReview'),
    beforeImage: str(fd, 'beforeImage'),
    afterImage: str(fd, 'afterImage'),
    gallery: jsonParse(fd, 'gallery'),
    featured: fd.get('featured') === 'on',
    enabled: fd.get('enabled') !== '', // Checkbox or similar logic
    order: Number(fd.get('order') || 0),
    
    // SEO
    seoTitle: str(fd, 'seoTitle'),
    seoDesc: str(fd, 'seoDesc'),
    seoKeywords: str(fd, 'seoKeywords'),
    focusKeyword: str(fd, 'focusKeyword'),
    ogTitle: str(fd, 'ogTitle'),
    ogDesc: str(fd, 'ogDesc'),
    ogImage: str(fd, 'ogImage'),
  };

  // Workaround for checkbox "enabled" when empty means false
  if (!fd.has('enabled')) {
      data.enabled = false;
  } else if (fd.get('enabled') === 'on') {
      data.enabled = true;
  }

  if (id) await prisma.testimonial.update({ where: { id }, data });
  else await prisma.testimonial.create({ data });

  try {
    await prisma.activityLog.create({
      data: {
        action: id ? 'updated' : 'created',
        module: 'testimonial',
        entityTitle: patientName,
        userId: (session.user as { id?: string })?.id || undefined,
      },
    });
  } catch { /* best-effort */ }

  revalidatePath('/admin/testimonials');
  revalidatePath('/testimonials');
}

export async function deleteTestimonial(id: string) {
  await guard();
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath('/admin/testimonials');
  revalidatePath('/testimonials');
}
