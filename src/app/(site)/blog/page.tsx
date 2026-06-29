import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ImageBox } from '@/components/ui/ImagePlaceholder';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const [posts, settings] = await Promise.all([
    prisma.blogPost.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } }),
    prisma.siteSetting.findUnique({ where: { id: 'main' } })
  ]);
  return (
    <>
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-32">
        <h1 className="mb-10 text-4xl font-extrabold text-brand-900">Blog</h1>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link key={p.id} href={`/blog/${p.slug}`} className="group overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-100 transition hover:-translate-y-1">
              <div className="relative h-48"><ImageBox src={p.featured} alt={p.title} /></div>
              <div className="p-6">
                {p.category && <span className="text-xs font-semibold uppercase text-brand-500">{p.category}</span>}
                <h3 className="mt-1 text-lg font-bold text-brand-900">{p.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">{p.excerpt}</p>
              </div>
            </Link>
          ))}
          {posts.length === 0 && <p className="text-slate-400">No blog posts yet.</p>}
        </div>
      </main>
    </>
  );
}
