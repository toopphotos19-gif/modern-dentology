import { prisma } from '@/lib/prisma';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AppointmentForm } from '@/components/forms/AppointmentForm';

export const dynamic = 'force-dynamic';

export default async function AppointmentPage() {
  const [services, doctors, settings] = await Promise.all([
    prisma.service.findMany({ where: { enabled: true }, orderBy: { order: 'asc' } }),
    prisma.doctor.findMany({ where: { enabled: true }, orderBy: { order: 'asc' } }),
    prisma.siteSetting.findUnique({ where: { id: 'main' } })
  ]);
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 pb-16 pt-32">
        <h1 className="mb-2 text-4xl font-extrabold text-brand-900">Book an Appointment</h1>
        <p className="mb-8 text-slate-500">Fill the form and we will confirm your appointment.</p>
        <AppointmentForm services={services.map((s) => ({ id: s.id, name: s.name }))} doctors={doctors.map((d) => ({ id: d.id, name: d.name }))} />
      </main>
      <Footer phone={settings?.phone} email={settings?.email} address={settings?.address} />
    </>
  );
}
