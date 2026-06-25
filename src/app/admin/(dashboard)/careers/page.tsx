import { prisma } from '@/lib/prisma';
import { setApplicationStatus } from './actions';

export const dynamic = 'force-dynamic';

const STATUSES = ['NEW', 'SHORTLISTED', 'INTERVIEW', 'REJECTED', 'HIRED'] as const;

export default async function AdminCareers() {
  const apps = await prisma.application.findMany({ orderBy: { createdAt: 'desc' }, include: { job: true } });
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-900">Job Applications</h1>
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Applicant</th>
              <th className="px-4 py-3">Position</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">CV</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((a) => (
              <tr key={a.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium">{a.name}</td>
                <td className="px-4 py-3">{a.job?.title || '-'}</td>
                <td className="px-4 py-3 text-slate-500">{a.phone}<br />{a.email}</td>
                <td className="px-4 py-3">{a.resumeUrl ? <a href={a.resumeUrl} target="_blank" className="text-brand-600 underline">Download</a> : '-'}</td>
                <td className="px-4 py-3">
                  <form action={async (fd) => { 'use server'; await setApplicationStatus(a.id, fd.get('status') as string); }}>
                    <select name="status" defaultValue={a.status} onChange={(e) => e.currentTarget.form?.requestSubmit()} className="rounded border border-slate-300 px-2 py-1">
                      {STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
                    </select>
                  </form>
                </td>
              </tr>
            ))}
            {apps.length === 0 && (<tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">No applications yet.</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
