import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ImageBox } from '@/components/ui/ImagePlaceholder';

export const dynamic = 'force-dynamic';

export default async function TechDetail({ params }: { params: { slug: string } }) {
  const [tech, settings] = await Promise.all([
    prisma.technology.findUnique({ where: { slug: params.slug } }),
    prisma.siteSetting.findUnique({ where: { id: 'main' } })
  ]);
  if (!tech || !tech.enabled) notFound();
  return (
    <>
      <Header />
      <main className="pt-28">
        <section className="mx-auto max-w-5xl px-4 py-16">
          <h1 className="text-3xl font-extrabold text-brand-900">{tech.name}</h1>
          <div className="relative mt-6 h-72 overflow-hidden rounded-2xl"><ImageBox src={tech.image} alt={tech.name} /></div>
          <p className="mt-6 whitespace-pre-line text-slate-600">{tech.description}</p>
        </section>
      </main>
      <Footer phone={settings?.phone} email={settings?.email} address={settings?.address} />
    </>
  );
}
