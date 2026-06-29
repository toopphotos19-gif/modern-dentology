import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ImageBox } from '@/components/ui/ImagePlaceholder';

export const dynamic = 'force-dynamic';

export default async function DoctorDetail({ params }: { params: { slug: string } }) {
  const decodedSlug = decodeURIComponent(params.slug);
  const [doctor, settings] = await Promise.all([
    prisma.doctor.findUnique({ where: { slug: decodedSlug } }),
    prisma.siteSetting.findUnique({ where: { id: 'main' } })
  ]);
  if (!doctor || !doctor.enabled) notFound();
  const specs = (doctor.specializations as string[]) || [];

  return (
    <>
      <Header />
      <main className="pt-28">
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="grid gap-10 md:grid-cols-3">
            <div className="relative h-80 overflow-hidden rounded-2xl md:col-span-1"><ImageBox src={doctor.photo} alt={doctor.name} /></div>
            <div className="md:col-span-2">
              <h1 className="text-3xl font-extrabold text-brand-900">{doctor.name}</h1>
              <p className="mt-1 text-brand-500">{doctor.qualification}</p>
              {doctor.experience && <p className="mt-1 text-sm text-slate-500">{doctor.experience} experience</p>}
              {doctor.bio && <p className="mt-6 whitespace-pre-line text-slate-600">{doctor.bio}</p>}
              {specs.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-2 font-bold text-brand-900">Specializations</h3>
                  <div className="flex flex-wrap gap-2">{specs.map((s, i) => (<span key={i} className="rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-700">{s}</span>))}</div>
                </div>
              )}
              <Link href="/appointment" className="mt-8 inline-block rounded-full bg-brand-500 px-8 py-3 font-semibold text-white hover:bg-brand-600">Book Appointment</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer phone={settings?.phone} email={settings?.email} address={settings?.address} />
    </>
  );
}
