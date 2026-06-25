'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { UploadField } from '@/components/admin/UploadField';
import { saveGallery } from '@/lib/adminActions';

export function GalleryManager({
  images,
  onDelete
}: {
  images: { id: string; url: string; caption: string | null }[];
  onDelete: (id: string) => Promise<void>;
}) {
  const router = useRouter();
  const [url, setUrl] = useState('');

  return (
    <div>
      <form
        action={async (fd) => { fd.set('url', url); await saveGallery(fd); setUrl(''); router.refresh(); }}
        className="mb-8 max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100"
      >
        <UploadField label="Upload Image" value={url} onChange={setUrl} />
        <input name="caption" placeholder="Caption (optional)" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        <button disabled={!url} className="rounded-lg bg-brand-500 px-5 py-2.5 font-semibold text-white hover:bg-brand-600 disabled:opacity-50">Add to Gallery</button>
      </form>
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img) => (
          <div key={img.id} className="group relative overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt={img.caption || ''} className="h-40 w-full object-cover" />
            <form action={async () => { await onDelete(img.id); router.refresh(); }} className="absolute right-2 top-2">
              <button className="rounded-full bg-white/90 p-2 text-red-500 opacity-0 transition group-hover:opacity-100"><Trash2 className="h-4 w-4" /></button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
