import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Metadata } from 'next';
import { Calendar, Clock, User } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post) return { title: 'Post Not Found' };
  
  return {
    title: post.metaTitle || post.title,
    description: post.metaDesc || post.excerpt,
    keywords: post.keywords,
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });

  if (!post || !post.published) notFound();

  return (
    <div className="pb-24 pt-24">
      <Container className="max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          {post.category && (
            <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600 mb-4">
              {post.category}
            </span>
          )}
          <h1 className="text-4xl font-bold text-slate-900 md:text-5xl mb-6 leading-tight">{post.title}</h1>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            {post.author && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" /> {post.author}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> {post.publishAt ? new Date(post.publishAt).toLocaleDateString() : new Date().toLocaleDateString()}
            </div>
            {post.readingTime && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> {post.readingTime} min read
              </div>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {post.featured && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.featured} alt={post.title} className="w-full aspect-[21/9] object-cover rounded-3xl shadow-lg mb-16" />
        )}

        {/* Content */}
        <div className="prose prose-lg prose-slate max-w-none prose-a:text-brand-500 hover:prose-a:text-brand-600 prose-img:rounded-2xl" dangerouslySetInnerHTML={{ __html: post.content }} />

        {/* Tags */}
        {(post.tags as string[] || []).length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-200 flex flex-wrap gap-2">
            {(post.tags as string[]).map((tag, i) => (
              <span key={i} className="rounded-lg bg-slate-100 px-3 py-1 text-sm text-slate-600">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
