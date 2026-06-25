import { prisma } from '@/lib/prisma';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ContactForm } from '@/components/forms/ContactForm';
import { Phone, Mail, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const settings = await prisma.siteSetting.findUnique({ where: { id: 'main' } });
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-32">
        <h1 className="mb-10 text-4xl font-extrabold text-brand-900">Contact Us</h1>
        <div className="grid gap-12 md:grid-cols-2">
          <div className="space-y-4 text-slate-600">
            {settings?.phone && <p className="flex gap-3"><Phone className="text-brand-500" /> {settings.phone}</p>}
            {settings?.email && <p className="flex gap-3"><Mail className="text-brand-500" /> {settings.email}</p>}
            {settings?.address && <p className="flex gap-3"><MapPin className="text-brand-500" /> {settings.address}</p>}
          </div>
          <ContactForm />
        </div>
      </main>
      <Footer phone={settings?.phone} email={settings?.email} address={settings?.address} />
    </>
  );
}
