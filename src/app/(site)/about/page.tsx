import { prisma } from '@/lib/prisma';
import { Container } from '@/components/ui/Container';
import { CheckCircle2, Award, History } from 'lucide-react';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const page = await prisma.aboutPage.findUnique({ where: { id: 'main' } });
  return {
    title: page?.metaTitle || 'About Us',
    description: page?.metaDesc || 'Learn more about our dental clinic, our mission, and our values.',
  };
}

export default async function AboutPage() {
  const page = await prisma.aboutPage.findUnique({ where: { id: 'main' } });

  const stats = (page?.statistics as any[]) || [];
  const timeline = (page?.timeline as any[]) || [];
  const awards = (page?.awards as any[]) || [];
  const reasons = (page?.whyChooseUs as any[]) || [];

  return (
    <div className="pb-24">
      {/* Banner */}
      <div className="relative h-[40vh] w-full bg-slate-900">
        {page?.bannerImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={page.bannerImage} alt="About Us" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white md:text-5xl">About Our Clinic</h1>
        </div>
      </div>

      <Container className="mt-16">
        {/* Mission & Vision */}
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-500">Our Mission</h2>
            <div className="mt-4 prose prose-slate max-w-none text-slate-600" dangerouslySetInnerHTML={{ __html: page?.mission || 'Providing exceptional dental care.' }} />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-500">Our Vision</h2>
            <div className="mt-4 prose prose-slate max-w-none text-slate-600" dangerouslySetInnerHTML={{ __html: page?.vision || 'To be the leading dental provider.' }} />
          </div>
        </div>

        {/* Stats */}
        {stats.length > 0 && (
          <div className="mt-24 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={i} className="rounded-2xl bg-brand-50 p-8 text-center">
                <div className="text-4xl font-bold text-brand-600">{stat.value}</div>
                <div className="mt-2 text-sm font-medium text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Why Choose Us */}
        {reasons.length > 0 && (
          <div className="mt-24">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Why Choose Us</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {reasons.map((r, i) => (
                <div key={i} className="flex gap-4">
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-brand-500" />
                  <div>
                    <h3 className="font-semibold text-slate-900">{r.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        {timeline.length > 0 && (
          <div className="mt-24">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-12 flex items-center justify-center gap-3">
              <History className="h-8 w-8 text-brand-500" /> Our History
            </h2>
            <div className="space-y-12">
              {timeline.map((t, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="md:w-32 shrink-0 pt-1 text-2xl font-bold text-brand-500">{t.year}</div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{t.title}</h3>
                    <p className="mt-3 text-slate-600 leading-relaxed">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Awards */}
        {awards.length > 0 && (
          <div className="mt-24 rounded-3xl bg-slate-900 p-12 text-white">
            <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-3">
              <Award className="h-8 w-8 text-amber-400" /> Awards & Recognitions
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {awards.map((a, i) => (
                <div key={i} className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-amber-400 mb-4">
                    <Award className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold">{a.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{a.year}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
