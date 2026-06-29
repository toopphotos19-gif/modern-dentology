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

export async function savePage(fd: FormData) {
  const session = await guard();
  const id = str(fd, 'id');
  const title = fd.get('title') as string;
  const data = {
    title,
    slug: str(fd, 'slug') || slugify(title),
    enabled: fd.get('enabled') === 'on',
    metaTitle: str(fd, 'metaTitle'),
    metaDesc: str(fd, 'metaDesc'),
    keywords: str(fd, 'keywords'),
    ogTitle: str(fd, 'ogTitle'),
    ogDesc: str(fd, 'ogDesc'),
    ogImage: str(fd, 'ogImage'),
    focusKeyword: str(fd, 'focusKeyword'),
  };

  if (id) await prisma.page.update({ where: { id }, data });
  else await prisma.page.create({ data });

  try {
    await prisma.activityLog.create({
      data: {
        action: id ? 'updated' : 'created',
        module: 'page',
        entityTitle: title,
        userId: (session.user as { id?: string })?.id || undefined,
      },
    });
  } catch { /* ignore */ }

  revalidatePath('/admin/pages');
}

export async function deletePage(id: string) {
  await guard();
  await prisma.page.delete({ where: { id } });
  revalidatePath('/admin/pages');
}

// Save all sections for a page
export async function savePageSections(pageId: string, sections: any[]) {
  const session = await guard();
  
  // Update in a transaction
  await prisma.$transaction(async (tx) => {
    // Delete existing sections not in the new array (or just delete all and recreate, 
    // but that breaks relations if any, though sections have no incoming relations).
    // Let's do a smart sync.
    const existing = await tx.pageSection.findMany({ where: { pageId }, select: { id: true } });
    const incomingIds = sections.map(s => s.id).filter(Boolean);
    const toDelete = existing.filter(e => !incomingIds.includes(e.id)).map(e => e.id);
    
    if (toDelete.length > 0) {
      await tx.pageSection.deleteMany({ where: { id: { in: toDelete } } });
    }

    // Upsert sections
    for (let i = 0; i < sections.length; i++) {
      const sec = sections[i];
      const data = {
        pageId,
        sectionType: sec.sectionType || 'content',
        heading: sec.heading || null,
        subHeading: sec.subHeading || null,
        description: sec.description || null,
        content: sec.content || null,
        images: sec.images || null,
        videos: sec.videos || null,
        icons: sec.icons || null,
        buttons: sec.buttons || null,
        bgImage: sec.bgImage || null,
        bgColor: sec.bgColor || null,
        layout: sec.layout || null,
        enabled: sec.enabled !== false,
        order: i, // Force order by array position
      };

      if (sec.id && !sec.id.startsWith('new-')) {
        await tx.pageSection.update({ where: { id: sec.id }, data });
      } else {
        await tx.pageSection.create({ data });
      }
    }
  });

  const page = await prisma.page.findUnique({ where: { id: pageId } });
  if (page) {
    revalidatePath(`/${page.slug === 'home' ? '' : page.slug}`);
  }
}
