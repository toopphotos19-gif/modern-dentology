import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Metadata } from 'next';
import { CheckCircle2, Cpu } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const tech = await prisma.technology.findUnique({ where: { slug: params.slug } });
  if (!tech) return { title: 'Technology Not Found' };
  
  return {
    title: tech.metaTitle || tech.name,
    description: tech.metaDesc || tech.shortDesc,
    keywords: tech.keywords,
  };
}

export default async function TechnologyPage({ params }: { params: { slug: string } }) {
  const tech = await prisma.technology.findUnique({ where: { slug: params.slug } });

  if (!tech || !tech.enabled) notFound();

  const features = (tech.features as any[]) || [];
  const benefits = (tech.benefits as string[]) || [];

  return (
    <div className="pb-24 pt-32">
      <Container>
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600 mb-6">
              <Cpu className="h-4 w-4" /> Dental Technology
            </div>
            <h1 className="text-4xl font-bold text-slate-900 md:text-5xl lg:text-6xl mb-6">{tech.name}</h1>
            <p className="text-lg text-slate-600 mb-8">{tech.shortDesc}</p>
            {tech.manufacturer && (
              <p className="text-sm font-medium text-slate-500 mb-8">Manufactured by: {tech.manufacturer}</p>
            )}
            <div className="flex gap-4">
              <Link href="/appointment" className="rounded-full bg-brand-500 px-8 py-3 font-semibold text-white transition hover:bg-brand-600">
                Book Consultation
              </Link>
            </div>
          </div>
          <div className="relative">
            {tech.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={tech.image} alt={tech.name} className="rounded-3xl shadow-2xl w-full object-cover aspect-square md:aspect-[4/3] lg:aspect-square" />
            )}
          </div>
        </div>

        <div className="mt-24 grid gap-16 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-16">
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">About this Technology</h2>
              <div className="prose prose-lg prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: tech.description }} />
            </section>

            {features.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-8">Key Features</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {features.map((f, i) => (
                    <div key={i} className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                      <h3 className="text-xl font-semibold text-slate-900">{f.title}</h3>
                      <p className="mt-2 text-slate-600">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-8">
            {benefits.length > 0 && (
              <div className="rounded-2xl bg-brand-50 p-8 border border-brand-100">
                <h3 className="text-xl font-bold text-brand-900 mb-6">Patient Benefits</h3>
                <ul className="space-y-4">
                  {benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-500 mt-0.5" />
                      <span className="text-slate-700 text-sm leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
