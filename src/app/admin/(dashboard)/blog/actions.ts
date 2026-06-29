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

function calcReadingTime(content: string) {
  const words = content.replace(/(<([^>]+)>)/gi, '').split(/\s+/).length;
  return Math.ceil(words / 225); // Average reading speed
}

export async function saveBlogPost(fd: FormData) {
  const session = await guard();
  const id = str(fd, 'id');
  const title = fd.get('title') as string;
  const content = fd.get('content') as string;

  const data = {
    title,
    slug: str(fd, 'slug') || slugify(title),
    excerpt: str(fd, 'excerpt'),
    content,
    featured: str(fd, 'featured'),
    
    category: str(fd, 'category'),
    author: str(fd, 'author'),
    tags: fd.get('tags') ? (fd.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean) : [],
    
    published: fd.get('published') === 'on',
    publishAt: str(fd, 'publishAt') ? new Date(fd.get('publishAt') as string) : null,
    
    gallery: jsonParse(fd, 'gallery'),
    videoEmbeds: jsonParse(fd, 'videoEmbeds'),
    readingTime: calcReadingTime(content),
    
    relatedBlogs: jsonParse(fd, 'relatedBlogs'),
    relatedServices: jsonParse(fd, 'relatedServices'),
    relatedDoctors: jsonParse(fd, 'relatedDoctors'),
    
    // SEO
    metaTitle: str(fd, 'metaTitle'),
    metaDesc: str(fd, 'metaDesc'),
    keywords: str(fd, 'keywords'),
    canonicalUrl: str(fd, 'canonicalUrl'),
    ogTitle: str(fd, 'ogTitle'),
    ogDesc: str(fd, 'ogDesc'),
    ogImage: str(fd, 'ogImage'),
    twitterTitle: str(fd, 'twitterTitle'),
    twitterDesc: str(fd, 'twitterDesc'),
    twitterImage: str(fd, 'twitterImage'),
    breadcrumb: str(fd, 'breadcrumb'),
  };

  if (id) await prisma.blogPost.update({ where: { id }, data });
  else await prisma.blogPost.create({ data });

  try {
    await prisma.activityLog.create({
      data: {
        action: id ? 'updated' : 'created',
        module: 'blog',
        entityTitle: title,
        userId: (session.user as { id?: string })?.id || undefined,
      },
    });
  } catch { /* best-effort */ }

  revalidatePath('/admin/blog');
  revalidatePath('/blog');
}

export async function deleteBlogPost(id: string) {
  await guard();
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath('/admin/blog');
  revalidatePath('/blog');
}
