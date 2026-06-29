'use client';

import { useTransition } from 'react';
import { setBookingStatus } from '@/app/admin/(dashboard)/bookings/actions';

const STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'RESCHEDULED'] as const;

export function BookingStatusSelect({ bookingId, currentStatus }: { bookingId: string; currentStatus: string }) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    startTransition(async () => {
      const fd = new FormData();
      fd.append('status', newStatus);
      await setBookingStatus(bookingId, fd);
    });
  };

  return (
    <select
      disabled={isPending}
      defaultValue={currentStatus}
      onChange={handleChange}
      className="rounded border border-slate-300 px-2 py-1 disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
