import { prisma } from '@/lib/prisma';
import { Container } from '@/components/ui/Container';
import { Metadata } from 'next';
import { Star, PlayCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Patient Testimonials',
  description: 'Read what our patients have to say about their experience.',
};

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    where: { enabled: true },
    orderBy: { order: 'asc' },
  });

  return (
    <div className="pb-24 pt-32 bg-slate-50 min-h-screen">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-slate-900 md:text-5xl mb-4">Patient Stories</h1>
          <p className="text-lg text-slate-600">Discover how we've helped transform smiles and improve the lives of our patients.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.id} className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100 flex flex-col h-full">
              <div className="flex text-amber-400 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < t.rating ? 'fill-current' : 'text-slate-200'}`} />
                ))}
              </div>
              <p className="text-slate-700 italic flex-grow mb-8 text-lg">&ldquo;{t.review}&rdquo;</p>
              
              <div className="flex items-center gap-4 mt-auto">
                {t.patientImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.patientImage} alt={t.patientName} className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600 font-bold text-lg">
                    {t.patientName.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-slate-900">{t.patientName}</h3>
                  {(t.treatment || t.patientLocation) && (
                    <p className="text-sm text-slate-500">{t.treatment} {t.patientLocation ? `• ${t.patientLocation}` : ''}</p>
                  )}
                </div>
              </div>
              
              {(t.videoUrl || t.videoReview) && (
                <a href={t.videoUrl || t.videoReview!} target="_blank" rel="noreferrer" className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-slate-50 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition">
                  <PlayCircle className="h-5 w-5 text-brand-500" /> Watch Video Review
                </a>
              )}
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
