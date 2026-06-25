import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ImageBox } from '@/components/ui/ImagePlaceholder';
import { Check } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const s = await prisma.service.findUnique({ where: { slug: params.slug } });
  return { title: s?.metaTitle || s?.name, description: s?.metaDesc || s?.shortDesc };
}

export default async function ServiceDetail({ params }: { params: { slug: string } }) {
  const [service, settings, related] = await Promise.all([
    prisma.service.findUnique({ where: { slug: params.slug } }),
    prisma.siteSetting.findUnique({ where: { id: 'main' } }),
    prisma.service.findMany({ where: { enabled: true }, orderBy: { order: 'asc' }, take: 3 })
  ]);
  if (!service || !service.enabled) notFound();

  const benefits = (service.benefits as string[]) || [];

  return (
    <>
      <Header />
      <main>
        <section className="relative h-80">
          <ImageBox src={service.banner || service.image} alt={service.name} />
          <div className="absolute inset-0 bg-brand-900/70" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-7xl px-4"><h1 className="text-4xl font-extrabold text-white">{service.name}</h1></div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <p className="whitespace-pre-line text-slate-600">{service.description}</p>
              {benefits.length > 0 && (
                <div className="mt-8">
                  <h2 className="mb-4 text-2xl font-bold text-brand-900">Benefits</h2>
                  <ul className="space-y-2">
                    {benefits.map((b, i) => (<li key={i} className="flex gap-2 text-slate-600"><Check className="h-5 w-5 text-brand-500" /> {b}</li>))}
                  </ul>
                </div>
              )}
            </div>
            <aside>
              <div className="rounded-2xl bg-brand-50 p-6">
                <h3 className="mb-2 text-lg font-bold text-brand-900">Ready to start?</h3>
                <p className="mb-4 text-sm text-slate-600">Book your appointment today.</p>
                <Link href="/appointment" className="block rounded-full bg-brand-500 py-3 text-center font-semibold text-white hover:bg-brand-600">Book Appointment</Link>
              </div>
              <div className="mt-8">
                <h3 className="mb-3 font-bold text-brand-900">Related Services</h3>
                <ul className="space-y-2">
                  {related.filter((r) => r.id !== service.id).map((r) => (<li key={r.id}><Link href={`/services/${r.slug}`} className="text-brand-600 hover:underline">{r.name}</Link></li>))}
                </ul>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer phone={settings?.phone} email={settings?.email} address={settings?.address} />
    </>
  );
}
