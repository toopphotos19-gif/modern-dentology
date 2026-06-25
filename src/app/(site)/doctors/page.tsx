import { prisma } from '@/lib/prisma';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CardGrid } from '@/components/home/CardGrid';

export const dynamic = 'force-dynamic';

export default async function DoctorsPage() {
  const [doctors, settings] = await Promise.all([
    prisma.doctor.findMany({ where: { enabled: true }, orderBy: { order: 'asc' } }),
    prisma.siteSetting.findUnique({ where: { id: 'main' } })
  ]);
  return (
    <>
      <Header />
      <main className="pt-28">
        <CardGrid eyebrow="Our Team" heading="Meet Our Doctors" cta="View Profile" cards={doctors.map((d) => ({ title: d.name, desc: d.qualification || '', image: d.photo, href: `/doctors/${d.slug}` }))} />
      </main>
      <Footer phone={settings?.phone} email={settings?.email} address={settings?.address} />
    </>
  );
}
