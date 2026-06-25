import { prisma } from '@/lib/prisma';
import { updateLead } from '@/lib/adminActions';

export const dynamic = 'force-dynamic';

const STATUSES = ['NEW', 'CONTACTED', 'INTERESTED', 'CONSULTATION_BOOKED', 'CONVERTED', 'LOST'] as const;

export default async function AdminLeads() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-900">Leads & Inquiries (CRM)</h1>
      <div className="space-y-4">
        {leads.map((l) => (
          <form key={l.id} action={async (fd) => { 'use server'; await updateLead(l.id, fd); }} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-brand-900">{l.name} <span className="text-sm font-normal text-slate-400">via {l.source}</span></p>
                <p className="text-sm text-slate-500">{l.email} {l.phone && `· ${l.phone}`}</p>
                {l.message && <p className="mt-2 text-sm text-slate-600">{l.message}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <select name="status" defaultValue={l.status} className="rounded border border-slate-300 px-2 py-1 text-sm">
                  {STATUSES.map((s) => (<option key={s} value={s}>{s.replace('_', ' ')}</option>))}
                </select>
                <input name="assignee" defaultValue={l.assignee || ''} placeholder="Assign to" className="rounded border border-slate-300 px-2 py-1 text-sm" />
              </div>
            </div>
            <textarea name="notes" defaultValue={l.notes || ''} placeholder="Follow-up notes" rows={2} className="mt-3 w-full rounded border border-slate-300 px-2 py-1 text-sm" />
            <button className="mt-2 rounded-lg bg-brand-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-600">Save</button>
          </form>
        ))}
        {leads.length === 0 && <p className="text-slate-400">No leads yet. Inquiries from the contact form appear here.</p>}
      </div>
    </div>
  );
}
