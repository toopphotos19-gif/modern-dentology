'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';
import { auth } from '@/lib/auth';

// Shared session guard for all admin write actions.
async function guard() {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');
}

function str(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === 'string' && v.length ? v : null;
}

// ---------- Doctors ----------
export async function saveDoctor(fd: FormData) {
  await guard();
  const id = str(fd, 'id');
  const name = fd.get('name') as string;
  const specs = (str(fd, 'specializations') || '').split(',').map((s) => s.trim()).filter(Boolean);
  const data = {
    name,
    slug: str(fd, 'slug') || slugify(name),
    qualification: str(fd, 'qualification'),
    experience: str(fd, 'experience'),
    bio: str(fd, 'bio'),
    photo: str(fd, 'photo'),
    specializations: specs,
    enabled: fd.get('enabled') === 'on',
    order: Number(fd.get('order') || 0)
  };
  if (id) await prisma.doctor.update({ where: { id }, data });
  else await prisma.doctor.create({ data });
  revalidatePath('/admin/doctors');
  revalidatePath('/doctors');
}
export async function deleteDoctor(id: string) {
  await guard();
  await prisma.doctor.delete({ where: { id } });
  revalidatePath('/admin/doctors');
}

// ---------- Technology ----------
export async function saveTechnology(fd: FormData) {
  await guard();
  const id = str(fd, 'id');
  const name = fd.get('name') as string;
  const data = {
    name,
    slug: str(fd, 'slug') || slugify(name),
    shortDesc: fd.get('shortDesc') as string,
    description: fd.get('description') as string,
    image: str(fd, 'image'),
    enabled: fd.get('enabled') === 'on',
    order: Number(fd.get('order') || 0)
  };
  if (id) await prisma.technology.update({ where: { id }, data });
  else await prisma.technology.create({ data });
  revalidatePath('/admin/technology');
  revalidatePath('/technology');
}
export async function deleteTechnology(id: string) {
  await guard();
  await prisma.technology.delete({ where: { id } });
  revalidatePath('/admin/technology');
}

// ---------- Testimonials ----------
export async function saveTestimonial(fd: FormData) {
  await guard();
  const id = str(fd, 'id');
  const data = {
    patientName: fd.get('patientName') as string,
    review: fd.get('review') as string,
    rating: Number(fd.get('rating') || 5),
    videoUrl: str(fd, 'videoUrl'),
    beforeImage: str(fd, 'beforeImage'),
    afterImage: str(fd, 'afterImage'),
    enabled: fd.get('enabled') === 'on',
    order: Number(fd.get('order') || 0)
  };
  if (id) await prisma.testimonial.update({ where: { id }, data });
  else await prisma.testimonial.create({ data });
  revalidatePath('/admin/testimonials');
  revalidatePath('/testimonials');
}
export async function deleteTestimonial(id: string) {
  await guard();
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath('/admin/testimonials');
}

// ---------- Blog ----------
export async function saveBlog(fd: FormData) {
  await guard();
  const id = str(fd, 'id');
  const title = fd.get('title') as string;
  const data = {
    title,
    slug: str(fd, 'slug') || slugify(title),
    excerpt: str(fd, 'excerpt'),
    content: fd.get('content') as string,
    featured: str(fd, 'featured'),
    category: str(fd, 'category'),
    author: str(fd, 'author'),
    published: fd.get('published') === 'on',
    metaTitle: str(fd, 'metaTitle'),
    metaDesc: str(fd, 'metaDesc')
  };
  if (id) await prisma.blogPost.update({ where: { id }, data });
  else await prisma.blogPost.create({ data });
  revalidatePath('/admin/blog');
  revalidatePath('/blog');
}
export async function deleteBlog(id: string) {
  await guard();
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath('/admin/blog');
}

// ---------- Gallery ----------
export async function saveGallery(fd: FormData) {
  await guard();
  const url = str(fd, 'url');
  if (!url) return;
  await prisma.galleryImage.create({
    data: { url, caption: str(fd, 'caption'), album: str(fd, 'album'), order: Number(fd.get('order') || 0) }
  });
  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
}
export async function deleteGallery(id: string) {
  await guard();
  await prisma.galleryImage.delete({ where: { id } });
  revalidatePath('/admin/gallery');
}

// ---------- FAQ ----------
export async function saveFaq(fd: FormData) {
  await guard();
  const id = str(fd, 'id');
  const data = {
    question: fd.get('question') as string,
    answer: fd.get('answer') as string,
    order: Number(fd.get('order') || 0),
    enabled: fd.get('enabled') === 'on'
  };
  if (id) await prisma.faq.update({ where: { id }, data });
  else await prisma.faq.create({ data });
  revalidatePath('/admin/faq');
  revalidatePath('/faq');
}
export async function deleteFaq(id: string) {
  await guard();
  await prisma.faq.delete({ where: { id } });
  revalidatePath('/admin/faq');
}

// ---------- Jobs ----------
export async function saveJob(fd: FormData) {
  await guard();
  const id = str(fd, 'id');
  const title = fd.get('title') as string;
  const data = {
    title,
    slug: str(fd, 'slug') || slugify(title),
    description: fd.get('description') as string,
    location: str(fd, 'location'),
    type: str(fd, 'type'),
    enabled: fd.get('enabled') === 'on'
  };
  if (id) await prisma.job.update({ where: { id }, data });
  else await prisma.job.create({ data });
  revalidatePath('/admin/jobs');
  revalidatePath('/careers');
}
export async function deleteJob(id: string) {
  await guard();
  await prisma.job.delete({ where: { id } });
  revalidatePath('/admin/jobs');
}

// ---------- Leads (CRM) ----------
export async function updateLead(id: string, fd: FormData) {
  await guard();
  await prisma.lead.update({
    where: { id },
    data: { status: fd.get('status') as never, assignee: str(fd, 'assignee'), notes: str(fd, 'notes') }
  });
  revalidatePath('/admin/leads');
}
