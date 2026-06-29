import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const doctor = await prisma.doctor.findUnique({ where: { slug: params.slug } });
  if (!doctor) return { title: 'Doctor Not Found' };
  
  return {
    title: doctor.metaTitle || doctor.name,
    description: doctor.metaDesc || doctor.qualification,
    keywords: doctor.keywords,
  };
}

export default async function DoctorProfilePage({ params }: { params: { slug: string } }) {
  const doctor = await prisma.doctor.findUnique({ where: { slug: params.slug } });

  if (!doctor || !doctor.enabled) notFound();

  return (
    <div className="pb-24 pt-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-1">
            {doctor.photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={doctor.photo} alt={doctor.name} className="w-full aspect-[3/4] object-cover rounded-3xl shadow-xl" />
            )}
            <div className="mt-8 text-center lg:text-left">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{doctor.name}</h1>
              <p className="text-brand-600 font-medium mb-4">{doctor.qualification}</p>
            </div>
          </div>
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Biography</h2>
            <div className="prose prose-lg prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: doctor.bio || '<p>Biography coming soon.</p>' }} />
          </div>
        </div>
      </Container>
    </div>
  );
}
