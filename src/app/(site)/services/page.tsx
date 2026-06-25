import { prisma } from '@/lib/prisma';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CardGrid } from '@/components/home/CardGrid';

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([
    prisma.service.findMany({ where: { enabled: true }, orderBy: { order: 'asc' } }),
    prisma.siteSetting.findUnique({ where: { id: 'main' } })
  ]);
  return (
    <>
      <Header />
      <main className="pt-28">
        <CardGrid eyebrow="Our Services" heading="Comprehensive Dental Care" cards={services.map((s) => ({ title: s.name, desc: s.shortDesc, image: s.image, href: `/services/${s.slug}` }))} />
      </main>
      <Footer phone={settings?.phone} email={settings?.email} address={settings?.address} />
    </>
  );
}
