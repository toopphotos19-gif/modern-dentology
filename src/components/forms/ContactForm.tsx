'use client';

import { useState } from 'react';

export function ContactForm() {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch('/api/contact', { method: 'POST', body: JSON.stringify(Object.fromEntries(fd)), headers: { 'Content-Type': 'application/json' } });
    setLoading(false);
    if (res.ok) setDone(true);
  }

  if (done) return <div className="rounded-xl bg-green-50 p-6 text-green-700">Thank you! Your message has been received. We will get back to you soon.</div>;

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <input name="name" placeholder="Your Name" required className="w-full rounded-lg border border-slate-300 px-3 py-2" />
      <input name="email" type="email" placeholder="Email" required className="w-full rounded-lg border border-slate-300 px-3 py-2" />
      <input name="phone" placeholder="Phone" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
      <textarea name="message" placeholder="Message" rows={4} required className="w-full rounded-lg border border-slate-300 px-3 py-2" />
      <button disabled={loading} className="w-full rounded-full bg-brand-500 py-3 font-semibold text-white hover:bg-brand-600 disabled:opacity-60">{loading ? 'Sending...' : 'Send Message'}</button>
    </form>
  );
}
