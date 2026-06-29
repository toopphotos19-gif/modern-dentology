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

export async function saveSiteSettings(formData: FormData) {
  const session = await guard();

  const data = {
    websiteName: str(formData, 'websiteName'),
    tagline: str(formData, 'tagline'),
    headerLogo: str(formData, 'headerLogo'),
    footerLogo: str(formData, 'footerLogo'),
    favicon: str(formData, 'favicon'),
    phone: str(formData, 'phone'),
    whatsapp: str(formData, 'whatsapp'),
    email: str(formData, 'email'),
    address: str(formData, 'address'),
    googleMapsUrl: str(formData, 'googleMapsUrl'),
    googleBusinessUrl: str(formData, 'googleBusinessUrl'),
    emergencyContact: str(formData, 'emergencyContact'),
    mapEmbed: str(formData, 'mapEmbed'),
    facebook: str(formData, 'facebook'),
    instagram: str(formData, 'instagram'),
    youtube: str(formData, 'youtube'),
    twitter: str(formData, 'twitter'),
    linkedin: str(formData, 'linkedin'),
    tiktok: str(formData, 'tiktok'),
    pinterest: str(formData, 'pinterest'),
    copyrightText: str(formData, 'copyrightText'),
    footerText: str(formData, 'footerText'),
    loadingAnimation: str(formData, 'loadingAnimation'),
    
    // JSON Fields
    workingHours: jsonParse(formData, 'workingHours'),
    themeColors: jsonParse(formData, 'themeColors'),
    fonts: jsonParse(formData, 'fonts'),
    buttonStyles: jsonParse(formData, 'buttonStyles'),
    globalIcons: jsonParse(formData, 'globalIcons'),
    websiteLoader: jsonParse(formData, 'websiteLoader'),
    announcementBar: jsonParse(formData, 'announcementBar'),
    cookieBanner: jsonParse(formData, 'cookieBanner'),
    newsletterPopup: jsonParse(formData, 'newsletterPopup'),
    headerMenu: jsonParse(formData, 'headerMenu'),
    footerMenu: jsonParse(formData, 'footerMenu'),
    
    // Default SEO
    metaTitle: str(formData, 'metaTitle'),
    metaDesc: str(formData, 'metaDesc'),
    keywords: str(formData, 'keywords'),
    robots: str(formData, 'robots'),
    sitemapEnabled: formData.get('sitemapEnabled') === 'on',
  };

  await prisma.siteSetting.upsert({
    where: { id: 'main' },
    update: data,
    create: { id: 'main', ...data },
  });

  try {
    await prisma.activityLog.create({
      data: {
        action: 'updated',
        module: 'settings',
        entityTitle: 'Global Website Settings',
        userId: (session.user as { id?: string })?.id || undefined,
      },
    });
  } catch { /* best-effort */ }

  revalidatePath('/', 'layout');
}
