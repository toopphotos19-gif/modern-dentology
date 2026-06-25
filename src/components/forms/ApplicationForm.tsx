'use client';

import { useState } from 'react';

export function ApplicationForm({ jobs }: { jobs: { id: string; title: string }[] }) {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  async function uploadCv(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload-public', { method: 'POST', body: fd });
    const data = await res.json();
    setUploading(false);
    if (res.ok) setResumeUrl(data.url);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const payload = { ...Object.fromEntries(fd), resumeUrl };
    const res = await fetch('/api/applications', { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } });
    setLoading(false);
    if (res.ok) setDone(true);
  }

  if (done) return <div className="rounded-xl bg-green-50 p-6 text-green-700">Application submitted! Our HR team will review it and contact you.</div>;

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <input name="name" placeholder="Full Name" required className="w-full rounded-lg border border-slate-300 px-3 py-2" />
      <input name="phone" placeholder="Phone" required className="w-full rounded-lg border border-slate-300 px-3 py-2" />
      <input name="email" type="email" placeholder="Email" required className="w-full rounded-lg border border-slate-300 px-3 py-2" />
      <input name="address" placeholder="Address" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
      <input name="qualification" placeholder="Qualification" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
      <input name="experience" placeholder="Experience" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
      <select name="jobId" className="w-full rounded-lg border border-slate-300 px-3 py-2"><option value="">Position (optional)</option>{jobs.map((j) => (<option key={j.id} value={j.id}>{j.title}</option>))}</select>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Resume (PDF)</label>
        <input type="file" accept=".pdf,.doc,.docx" onChange={uploadCv} />
        {uploading && <p className="text-xs text-slate-400">Uploading...</p>}
        {resumeUrl && <p className="text-xs text-green-600">CV uploaded.</p>}
      </div>
      <button disabled={loading} className="w-full rounded-full bg-brand-500 py-3 font-semibold text-white hover:bg-brand-600 disabled:opacity-60">{loading ? 'Submitting...' : 'Submit Application'}</button>
    </form>
  );
}
