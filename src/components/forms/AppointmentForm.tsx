'use client';

import { useState } from 'react';

export function AppointmentForm({
  services,
  doctors
}: {
  services: { id: string; name: string }[];
  doctors: { id: string; name: string }[];
}) {
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    const res = await fetch('/api/bookings', { method: 'POST', body: JSON.stringify(Object.fromEntries(fd)), headers: { 'Content-Type': 'application/json' } });
    setLoading(false);
    if (res.ok) setDone(true);
    else setError('Something went wrong. Please try again.');
  }

  if (done) return <div className="rounded-xl bg-green-50 p-6 text-green-700">Thank you! Your appointment request was submitted with status <b>Pending</b>. We will contact you to confirm.</div>;

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <In name="name" label="Full Name" required />
      <In name="phone" label="Phone Number" required />
      <In name="email" label="Email" type="email" required />
      <Sel name="serviceId" label="Service" options={services.map((s) => ({ value: s.id, label: s.name }))} />
      <Sel name="doctorId" label="Preferred Doctor" options={doctors.map((d) => ({ value: d.id, label: d.name }))} />
      <div className="grid grid-cols-2 gap-4">
        <In name="date" label="Date" type="date" required />
        <In name="time" label="Time" type="time" required />
      </div>
      <Area name="message" label="Message (optional)" />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button disabled={loading} className="w-full rounded-full bg-brand-500 py-3 font-semibold text-white hover:bg-brand-600 disabled:opacity-60">{loading ? 'Submitting...' : 'Request Appointment'}</button>
    </form>
  );
}

function In({ name, label, ...rest }: { name: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (<div><label className="mb-1 block text-sm font-medium text-slate-700">{label}</label><input name={name} {...rest} className="w-full rounded-lg border border-slate-300 px-3 py-2" /></div>);
}
function Sel({ name, label, options }: { name: string; label: string; options: { value: string; label: string }[] }) {
  return (<div><label className="mb-1 block text-sm font-medium text-slate-700">{label}</label><select name={name} className="w-full rounded-lg border border-slate-300 px-3 py-2"><option value="">Select...</option>{options.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}</select></div>);
}
function Area({ name, label }: { name: string; label: string }) {
  return (<div><label className="mb-1 block text-sm font-medium text-slate-700">{label}</label><textarea name={name} rows={3} className="w-full rounded-lg border border-slate-300 px-3 py-2" /></div>);
}
