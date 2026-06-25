import { prisma } from '@/lib/prisma';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ImageBox } from '@/components/ui/ImagePlaceholder';
import { SITE } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const settings = await prisma.siteSetting.findUnique({ where: { id: 'main' } });
  return (
    <>
      <Header />
      <main className="pt-28">
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="grid gap-12 md:grid-cols-2">
            <div className="relative h-96 overflow-hidden rounded-2xl"><ImageBox src={settings?.aboutImage} alt="About" /></div>
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-brand-500">About Us</span>
              <h1 className="mt-2 text-4xl font-extrabold text-brand-900">{SITE.name}</h1>
              <p className="mt-6 whitespace-pre-line text-slate-600">{settings?.aboutText || 'We are a premium dental clinic led by Dr. Abdul Basit, combining world-class technology with compassionate, patient-first care. Edit this text from the admin Site Settings.'}</p>
            </div>
          </div>
        </section>
      </main>
      <Footer phone={settings?.phone} email={settings?.email} address={settings?.address} />
    </>
  );
}
