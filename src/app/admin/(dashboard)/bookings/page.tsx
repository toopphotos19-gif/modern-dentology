import { prisma } from '@/lib/prisma';
import { BookingStatusSelect } from '@/components/admin/BookingStatusSelect';

export const dynamic = 'force-dynamic';

export default async function AdminBookings() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    include: { service: true, doctor: true }
  });
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-900">Appointment Bookings</h1>
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Service / Doctor</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium">{b.name}</td>
                <td className="px-4 py-3 text-slate-500">{b.phone}<br />{b.email}</td>
                <td className="px-4 py-3">{b.service?.name || '-'}<br /><span className="text-slate-400">{b.doctor?.name || ''}</span></td>
                <td className="px-4 py-3">{new Date(b.date).toLocaleDateString()} {b.time}</td>
                <td className="px-4 py-3">
                  <BookingStatusSelect bookingId={b.id} currentStatus={b.status} />
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (<tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">No bookings yet.</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
