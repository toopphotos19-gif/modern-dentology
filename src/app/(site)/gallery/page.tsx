import { prisma } from '@/lib/prisma';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ImageBox } from '@/components/ui/ImagePlaceholder';

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const [images, settings] = await Promise.all([
    prisma.galleryImage.findMany({ orderBy: { order: 'asc' } }),
    prisma.siteSetting.findUnique({ where: { id: 'main' } })
  ]);
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-32">
        <h1 className="mb-10 text-4xl font-extrabold text-brand-900">Gallery</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img) => (
            <div key={img.id} className="relative h-60 overflow-hidden rounded-xl"><ImageBox src={img.url} alt={img.caption || ''} /></div>
          ))}
          {images.length === 0 && <p className="text-slate-400">No gallery images yet. Add them from admin.</p>}
        </div>
      </main>
      <Footer phone={settings?.phone} email={settings?.email} address={settings?.address} />
    </>
  );
}
