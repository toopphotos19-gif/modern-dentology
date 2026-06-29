'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
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

export async function saveAboutPage(formData: FormData) {
  const session = await guard();

  const data = {
    // Images
    bannerImage: str(formData, 'bannerImage'),
    aboutImage: str(formData, 'aboutImage'),
    ownerImage: str(formData, 'ownerImage'),
    clinicImages: jsonParse(formData, 'clinicImages'),
    
    // Content
    mission: str(formData, 'mission'),
    vision: str(formData, 'vision'),
    history: str(formData, 'history'),
    timeline: jsonParse(formData, 'timeline'),
    statistics: jsonParse(formData, 'statistics'),
    awards: jsonParse(formData, 'awards'),
    certificates: jsonParse(formData, 'certificates'),
    whyChooseUs: jsonParse(formData, 'whyChooseUs'),
    
    // CTA
    ctaTitle: str(formData, 'ctaTitle'),
    ctaDescription: str(formData, 'ctaDescription'),
    ctaButtonText: str(formData, 'ctaButtonText'),
    ctaButtonLink: str(formData, 'ctaButtonLink'),
    ctaImage: str(formData, 'ctaImage'),
    
    // SEO
    metaTitle: str(formData, 'metaTitle'),
    metaDesc: str(formData, 'metaDesc'),
    keywords: str(formData, 'keywords'),
    ogTitle: str(formData, 'ogTitle'),
    ogDesc: str(formData, 'ogDesc'),
    ogImage: str(formData, 'ogImage'),
  };

  await prisma.aboutPage.upsert({
    where: { id: 'main' },
    update: data,
    create: { id: 'main', ...data },
  });

  try {
    await prisma.activityLog.create({
      data: {
        action: 'updated',
        module: 'about-page',
        entityTitle: 'About Page',
        userId: (session.user as { id?: string })?.id || undefined,
      },
    });
  } catch { /* best-effort */ }

  revalidatePath('/about');
  revalidatePath('/admin/about');
}
