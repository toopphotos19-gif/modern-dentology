import { prisma } from '@/lib/prisma';
import { GalleryManager } from '@/components/admin/GalleryManager';
import { deleteGallery } from '@/lib/adminActions';

export const dynamic = 'force-dynamic';

export default async function AdminGallery() {
  const images = await prisma.galleryImage.findMany({ orderBy: { order: 'asc' } });
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-900">Gallery</h1>
      <GalleryManager images={images.map((i) => ({ id: i.id, url: i.url, caption: i.caption }))} onDelete={deleteGallery} />
    </div>
  );
}
