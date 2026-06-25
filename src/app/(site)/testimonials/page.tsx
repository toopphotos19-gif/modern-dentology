import { prisma } from '@/lib/prisma';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Testimonials } from '@/components/home/Testimonials';

export const dynamic = 'force-dynamic';

export default async function TestimonialsPage() {
  const [reviews, settings] = await Promise.all([
    prisma.testimonial.findMany({ where: { enabled: true }, orderBy: { order: 'asc' } }),
    prisma.siteSetting.findUnique({ where: { id: 'main' } })
  ]);
  return (
    <>
      <Header />
      <main className="pt-20">
        <Testimonials reviews={reviews.map((r) => ({ patientName: r.patientName, review: r.review, rating: r.rating }))} />
      </main>
      <Footer phone={settings?.phone} email={settings?.email} address={settings?.address} />
    </>
  );
}
