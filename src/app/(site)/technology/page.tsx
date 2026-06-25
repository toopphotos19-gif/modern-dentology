import { prisma } from '@/lib/prisma';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CardGrid } from '@/components/home/CardGrid';

export const dynamic = 'force-dynamic';

export default async function TechnologyPage() {
  const [techs, settings] = await Promise.all([
    prisma.technology.findMany({ where: { enabled: true }, orderBy: { order: 'asc' } }),
    prisma.siteSetting.findUnique({ where: { id: 'main' } })
  ]);
  return (
    <>
      <Header />
      <main className="pt-28">
        <CardGrid eyebrow="Technology" heading="Advanced Dental Technology" cta="Explore" cards={techs.map((t) => ({ title: t.name, desc: t.shortDesc, image: t.image, href: `/technology/${t.slug}` }))} />
      </main>
      <Footer phone={settings?.phone} email={settings?.email} address={settings?.address} />
    </>
  );
}
