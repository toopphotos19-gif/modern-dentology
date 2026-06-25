import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

// Dashboard overview: counts + quick links.
export default async function AdminHome() {
  const [services, doctors, techs, bookings, leads, applications] =
    await Promise.all([
      prisma.service.count(),
      prisma.doctor.count(),
      prisma.technology.count(),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'PENDING' } }),
      prisma.application.count()
    ]);

  const cards = [
    { label: 'Services', value: services, href: '/admin/services' },
    { label: 'Doctors', value: doctors, href: '/admin/doctors' },
    { label: 'Technologies', value: techs, href: '/admin/technology' },
    { label: 'Total Bookings', value: bookings, href: '/admin/bookings' },
    { label: 'Pending Bookings', value: leads, href: '/admin/bookings' },
    { label: 'Job Applications', value: applications, href: '/admin/careers' }
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-900">Dashboard</h1>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md">
            <div className="text-3xl font-bold text-brand-600">{c.value}</div>
            <div className="mt-1 text-sm text-slate-500">{c.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
