'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function saveSettings(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  const data = {
    heroTitle: formData.get('heroTitle') as string,
    heroSubtitle: formData.get('heroSubtitle') as string,
    heroDesc: formData.get('heroDesc') as string,
    heroImage: (formData.get('heroImage') as string) || null,
    heroVideo: (formData.get('heroVideo') as string) || null,
    heroBtn1Text: formData.get('heroBtn1Text') as string,
    heroBtn1Link: formData.get('heroBtn1Link') as string,
    heroBtn2Text: formData.get('heroBtn2Text') as string,
    heroBtn2Link: formData.get('heroBtn2Link') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string,
    address: formData.get('address') as string,
    facebook: formData.get('facebook') as string,
    instagram: formData.get('instagram') as string,
    youtube: formData.get('youtube') as string,
    metaTitle: formData.get('metaTitle') as string,
    metaDesc: formData.get('metaDesc') as string
  };

  await prisma.siteSetting.upsert({
    where: { id: 'main' },
    update: data,
    create: { id: 'main', ...data }
  });
  revalidatePath('/');
  revalidatePath('/admin/settings');
}
