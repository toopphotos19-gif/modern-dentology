import { prisma } from '@/lib/prisma';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const dynamic = 'force-dynamic';

export default async function FaqPage() {
  const [faqs, settings] = await Promise.all([
    prisma.faq.findMany({ where: { enabled: true }, orderBy: { order: 'asc' } }),
    prisma.siteSetting.findUnique({ where: { id: 'main' } })
  ]);
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 pb-16 pt-32">
        <h1 className="mb-10 text-4xl font-extrabold text-brand-900">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {faqs.map((f) => (
            <details key={f.id} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <summary className="cursor-pointer font-semibold text-brand-900">{f.question}</summary>
              <p className="mt-3 text-slate-600">{f.answer}</p>
            </details>
          ))}
          {faqs.length === 0 && <p className="text-slate-400">No FAQs yet. Add them from admin.</p>}
        </div>
      </main>
      <Footer phone={settings?.phone} email={settings?.email} address={settings?.address} />
    </>
  );
}
