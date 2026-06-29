import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = await prisma.page.findUnique({ where: { slug: params.slug } });
  if (!page) return { title: 'Page Not Found' };
  
  return {
    title: page.metaTitle || page.title,
    description: page.metaDesc || page.title,
    keywords: page.keywords,
  };
}

export default async function DynamicPage({ params }: { params: { slug: string } }) {
  const page = await prisma.page.findUnique({
    where: { slug: params.slug },
    include: { sections: { orderBy: { order: 'asc' } } }
  });

  if (!page || !page.enabled) notFound();

  return (
    <div className="pb-24 pt-20 min-h-screen">
      {page.sections.map((section) => {
        if (!section.enabled) return null;

        const buttons = (section.buttons as any[]) || [];
        const images = (section.images as any[]) || [];

        switch (section.sectionType) {
          case 'hero':
            return (
              <section key={section.id} className="relative h-[60vh] w-full bg-slate-900 flex items-center mb-16" style={section.bgColor ? { backgroundColor: section.bgColor } : {}}>
                {section.bgImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={section.bgImage} alt={section.heading || 'Hero'} className="absolute inset-0 h-full w-full object-cover opacity-50" />
                )}
                <Container className="relative z-10 text-center text-white">
                  {section.subHeading && <p className="text-brand-400 font-bold uppercase tracking-wider mb-4">{section.subHeading}</p>}
                  {section.heading && <h1 className="text-4xl md:text-6xl font-bold mb-6">{section.heading}</h1>}
                  {section.description && <p className="text-lg md:text-xl max-w-2xl mx-auto text-slate-200">{section.description}</p>}
                  {buttons.length > 0 && (
                    <div className="mt-8 flex justify-center gap-4">
                      {buttons.map((btn, i) => (
                        <Link key={i} href={btn.link || '#'} className={`rounded-full px-8 py-3 font-semibold transition ${i === 0 ? 'bg-brand-500 hover:bg-brand-600' : 'bg-white/10 hover:bg-white/20'}`}>
                          {btn.text}
                        </Link>
                      ))}
                    </div>
                  )}
                </Container>
              </section>
            );

          case 'content':
            return (
              <div key={section.id} style={section.bgColor ? { backgroundColor: section.bgColor } : {}} className="py-16">
                <Container>
                  <div className="prose prose-lg prose-slate max-w-4xl mx-auto" dangerouslySetInnerHTML={{ __html: (section.content as string) || '' }} />
                </Container>
              </div>
            );

          case 'features':
            const items = (section.content as any[]) || [];
            return (
              <div key={section.id} style={section.bgColor ? { backgroundColor: section.bgColor } : {}} className="py-24">
                <Container>
                  <div className="text-center max-w-2xl mx-auto mb-16">
                    {section.subHeading && <h3 className="text-brand-500 font-bold tracking-wider uppercase mb-3">{section.subHeading}</h3>}
                    {section.heading && <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{section.heading}</h2>}
                    {section.description && <p className="text-slate-600 text-lg">{section.description}</p>}
                  </div>
                  {items.length > 0 && (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                      {items.map((item: any, i: number) => (
                        <div key={i} className="rounded-2xl p-8 bg-slate-50 border border-slate-100">
                          <h4 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h4>
                          <p className="text-slate-600">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </Container>
              </div>
            );

          case 'cta':
            return (
              <Container key={section.id} className="my-24">
                <div className="rounded-3xl p-12 md:p-16 text-center bg-brand-50 text-brand-900 border border-brand-100" style={section.bgColor ? { backgroundColor: section.bgColor } : {}}>
                  {section.heading && <h2 className="text-3xl md:text-5xl font-bold mb-6">{section.heading}</h2>}
                  {section.description && <p className="text-lg max-w-2xl mx-auto mb-8 text-brand-700">{section.description}</p>}
                  {buttons.length > 0 && (
                    <Link href={buttons[0].link || '#'} className="inline-flex rounded-full px-8 py-4 font-bold transition shadow-lg bg-brand-600 text-white hover:bg-brand-700">
                      {buttons[0].text}
                    </Link>
                  )}
                </div>
              </Container>
            );

          case 'gallery':
            return (
              <div key={section.id} style={section.bgColor ? { backgroundColor: section.bgColor } : {}} className="py-24">
                <Container>
                  {section.heading && <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12">{section.heading}</h2>}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {images.map((img: any, i: number) => (
                      <div key={i} className="relative aspect-square overflow-hidden rounded-2xl">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.url} alt={img.caption || `Gallery image ${i+1}`} className="absolute inset-0 h-full w-full object-cover transition-transform hover:scale-105 duration-500" />
                      </div>
                    ))}
                  </div>
                </Container>
              </div>
            );

          default:
            return (
              <Container key={section.id} className="my-16">
                <div className="rounded-xl bg-slate-100 p-8 text-center text-slate-500">
                  Unsupported section type: {section.sectionType}
                </div>
              </Container>
            );
        }
      })}
    </div>
  );
}
