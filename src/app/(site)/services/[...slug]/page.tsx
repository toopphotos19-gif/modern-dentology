import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Metadata } from 'next';
import { CheckCircle2, Clock, Calendar } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string[] } }): Promise<Metadata> {
  const slug = params.slug.join('/');
  const service = await prisma.service.findUnique({ where: { slug } });
  
  if (!service) return { title: 'Service Not Found' };
  
  return {
    title: service.metaTitle || service.name,
    description: service.metaDesc || service.shortDesc,
    keywords: service.keywords,
  };
}

export default async function ServicePage({ params }: { params: { slug: string[] } }) {
  const slug = params.slug.join('/');
  const service = await prisma.service.findUnique({
    where: { slug },
    include: { features: { orderBy: { order: 'asc' } } }
  });

  if (!service || !service.enabled) notFound();

  const features = (service.features as any[]) || [];
  const gallery = (service.gallery as any[]) || [];
  const benefits = (service.benefits as string[]) || [];
  const faqs = (service.faqs as any[]) || [];

  return (
    <div className="pb-24">
      <div className="relative h-[50vh] w-full bg-slate-900">
        {(service.banner || service.image) && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={service.banner || service.image!} alt={service.name} className="absolute inset-0 h-full w-full object-cover opacity-50" />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white md:text-6xl px-4">{service.name}</h1>
            <p className="mt-4 text-lg text-slate-200 max-w-2xl mx-auto px-4">{service.shortDesc}</p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/appointment" className="rounded-full bg-brand-500 px-8 py-3 font-semibold text-white transition hover:bg-brand-600">
                Book Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Container className="mt-16">
        <div className="grid gap-16 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-16">
            
            {/* Introduction */}
            {service.introduction && (
              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Overview</h2>
                <div className="prose prose-lg prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: service.introduction }} />
              </section>
            )}

            {/* Description */}
            {service.description && (
              <section>
                <div className="prose prose-lg prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: service.description }} />
              </section>
            )}

            {/* Benefits */}
            {benefits.length > 0 && (
              <section className="rounded-2xl bg-slate-50 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Key Benefits</h2>
                <ul className="grid gap-4 sm:grid-cols-2">
                  {benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 shrink-0 text-brand-500 mt-0.5" />
                      <span className="text-slate-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Features (Grid) */}
            {features.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-8">What to Expect</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {features.map((f, i) => (
                    <div key={i} className="rounded-xl border border-slate-100 p-6 shadow-sm">
                      <h3 className="text-xl font-semibold text-slate-900">{f.title}</h3>
                      <p className="mt-2 text-slate-600">{f.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* FAQs */}
            {faqs.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {faqs.map((faq, i) => (
                    <details key={i} className="group rounded-xl border border-slate-200 bg-white p-6 open:shadow-sm">
                      <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-900 marker:content-none">
                        {faq.q}
                        <span className="transition group-open:rotate-180">
                          <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                        </span>
                      </summary>
                      <p className="mt-4 text-slate-600">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-8">
            <div className="rounded-2xl bg-brand-50 p-8 border border-brand-100">
              <h3 className="text-xl font-bold text-brand-900">Ready to transform your smile?</h3>
              <p className="mt-3 text-sm text-brand-700">Schedule your consultation today and take the first step towards a healthier, more beautiful smile.</p>
              <Link href="/appointment" className="mt-6 flex w-full items-center justify-center rounded-xl bg-brand-500 py-3 font-semibold text-white shadow-sm transition hover:bg-brand-600">
                Book Appointment
              </Link>
            </div>

            {service.downloadPdf && (
              <a href={service.downloadPdf} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition">
                <div className="rounded-lg bg-red-50 p-2 text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h2"/><path d="M8 17h2"/><path d="M14 13h2"/><path d="M14 17h2"/></svg>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Treatment Guide</h4>
                  <p className="text-xs text-slate-500">Download PDF brochure</p>
                </div>
              </a>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
