import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ImageBox } from '@/components/ui/ImagePlaceholder';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  return { title: p?.metaTitle || p?.title, description: p?.metaDesc || p?.excerpt };
}

export default async function BlogDetail({ params }: { params: { slug: string } }) {
  const [post, settings] = await Promise.all([
    prisma.blogPost.findUnique({ where: { slug: params.slug } }),
    prisma.siteSetting.findUnique({ where: { id: 'main' } })
  ]);
  if (!post || !post.published) notFound();
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 pb-16 pt-32">
        <h1 className="text-4xl font-extrabold text-brand-900">{post.title}</h1>
        <p className="mt-2 text-sm text-slate-500">{post.author} {post.category && `· ${post.category}`}</p>
        <div className="relative mt-6 h-72 overflow-hidden rounded-2xl"><ImageBox src={post.featured} alt={post.title} /></div>
        <article className="prose mt-8 max-w-none whitespace-pre-line text-slate-700">{post.content}</article>
      </main>
      <Footer phone={settings?.phone} email={settings?.email} address={settings?.address} />
    </>
  );
}
