import { prisma } from '@/lib/prisma';
import { ApplicationForm } from '@/components/forms/ApplicationForm';

export const dynamic = 'force-dynamic';

export default async function CareersPage() {
  const [jobs, settings] = await Promise.all([
    prisma.job.findMany({ where: { enabled: true }, orderBy: { createdAt: 'desc' } }),
    prisma.siteSetting.findUnique({ where: { id: 'main' } })
  ]);
  return (
    <>
      <main className="mx-auto max-w-3xl px-4 pb-16 pt-32">
        <h1 className="mb-2 text-4xl font-extrabold text-brand-900">Careers</h1>
        <p className="mb-8 text-slate-500">Join the Modern Dentology team.</p>
        {jobs.length > 0 && (
          <div className="mb-10 space-y-3">
            {jobs.map((j) => (
              <div key={j.id} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <h3 className="font-bold text-brand-900">{j.title}</h3>
                <p className="text-sm text-slate-500">{j.location} {j.type && `· ${j.type}`}</p>
                <p className="mt-2 text-sm text-slate-600">{j.description}</p>
              </div>
            ))}
          </div>
        )}
        <h2 className="mb-4 text-2xl font-bold text-brand-900">Apply Now</h2>
        <ApplicationForm jobs={jobs.map((j) => ({ id: j.id, title: j.title }))} />
      </main>
    </>
  );
}
