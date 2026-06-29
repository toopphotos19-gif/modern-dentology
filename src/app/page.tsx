import { prisma } from '@/lib/prisma';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Hero } from '@/components/home/Hero';
import { Stats } from '@/components/home/Stats';
import { CardGrid } from '@/components/home/CardGrid';
import { Testimonials } from '@/components/home/Testimonials';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [settings, services, doctors, technologies, testimonials] =
    await Promise.all([
      prisma.siteSetting.findUnique({ where: { id: 'main' } }),
      prisma.service.findMany({ where: { enabled: true }, orderBy: { order: 'asc' }, take: 6 }),
      prisma.doctor.findMany({ where: { enabled: true }, orderBy: { order: 'asc' }, take: 3 }),
      prisma.technology.findMany({ where: { enabled: true }, orderBy: { order: 'asc' }, take: 6 }),
      prisma.testimonial.findMany({ where: { enabled: true, featured: true }, orderBy: { order: 'asc' }, take: 3 })
    ]);

  const stats = (settings?.stats as { label: string; value: string }[]) || [];

  return (
    <>
      <SiteHeader />
      <main>
        <Hero
          title={settings?.heroTitle}
          subtitle={settings?.heroSubtitle}
          desc={settings?.heroDesc}
          image={settings?.heroImage}
          video={settings?.heroVideo}
          btn1Text={settings?.heroBtn1Text}
          btn1Link={settings?.heroBtn1Link}
          btn2Text={settings?.heroBtn2Text}
          btn2Link={settings?.heroBtn2Link}
        />
        <Stats stats={stats} />
        <CardGrid eyebrow="Our Services" heading="Comprehensive Dental Care" cards={services.map((s) => ({ title: s.name, desc: s.shortDesc, image: s.image, href: `/services/${s.slug}` }))} />
        <Testimonials reviews={testimonials.map((t) => ({ patientName: t.patientName, review: t.review, rating: t.rating }))} />
        <CardGrid eyebrow="Technology" heading="Advanced Dental Technology" cta="Explore" cards={technologies.map((t) => ({ title: t.name, desc: t.shortDesc, image: t.image, href: `/technology/${t.slug}` }))} />
        <CardGrid eyebrow="Our Team" heading="Meet Our Expert Doctors" cta="View Profile" cards={doctors.map((d) => ({ title: d.name, desc: d.qualification || '', image: d.photo, href: `/doctors/${d.slug}` }))} />
      </main>
      <SiteFooter />
    </>
  );
}
