'use client';

import { useState, useRef } from 'react';
import { Upload, X, GripVertical, Trash2, Eye } from 'lucide-react';
import { clsx } from 'clsx';

export type GalleryItem = {
  id: string;
  url: string;
  caption?: string;
  altText?: string;
  type?: string;
};

export function MultiImageUpload({
  images,
  onChange,
  label = 'Gallery Images',
  maxImages = 50,
}: {
  images: GalleryItem[];
  onChange: (images: GalleryItem[]) => void;
  label?: string;
  maxImages?: number;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      const newImages: GalleryItem[] = [];
      for (const file of files) {
        if (images.length + newImages.length >= maxImages) break;

        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');

        newImages.push({
          id: Date.now().toString(36) + Math.random().toString(36).slice(2),
          url: data.url,
          caption: '',
          altText: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
          type: file.type.startsWith('video/') ? 'video' : 'image',
        });
      }
      onChange([...images, ...newImages]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  function removeImage(id: string) {
    onChange(images.filter((img) => img.id !== id));
  }

  function updateImage(id: string, key: keyof GalleryItem, value: string) {
    onChange(images.map((img) => (img.id === id ? { ...img, [key]: value } : img)));
  }

  function moveImage(index: number, direction: 'left' | 'right') {
    const newImages = [...images];
    const target = direction === 'left' ? index - 1 : index + 1;
    if (target < 0 || target >= newImages.length) return;
    [newImages[index], newImages[target]] = [newImages[target], newImages[index]];
    onChange(newImages);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label} ({images.length}/{maxImages})
        </label>
      </div>

      {/* Hidden input for form serialization */}
      <input type="hidden" name="gallery" value={JSON.stringify(images)} />

      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((img, index) => (
          <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 ring-1 ring-slate-200 dark:ring-slate-600">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt={img.altText || ''} className="h-full w-full object-cover" />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setEditingId(editingId === img.id ? null : img.id)}
                  className="rounded-lg bg-white/90 p-2 text-slate-700 hover:bg-white transition"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="rounded-lg bg-red-500/90 p-2 text-white hover:bg-red-500 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {/* Index badge */}
            <span className="absolute top-2 left-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white">
              {index + 1}
            </span>
          </div>
        ))}

        {/* Upload Button */}
        {images.length < maxImages && (
          <label className={clsx(
            'flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors',
            'border-slate-300 dark:border-slate-600 hover:border-brand-500 hover:bg-brand-50/50 dark:hover:bg-brand-900/10',
            uploading && 'pointer-events-none opacity-50'
          )}>
            <Upload className="h-6 w-6 text-slate-400 mb-1" />
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {uploading ? 'Uploading...' : 'Upload'}
            </span>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleFiles}
            />
          </label>
        )}
      </div>

      {error && <p className="text-xs text-red-500">⚠ {error}</p>}

      {/* Edit Panel */}
      {editingId && (() => {
        const img = images.find((i) => i.id === editingId);
        if (!img) return null;
        return (
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Edit Image Details</p>
              <button type="button" onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Alt Text</label>
                <input
                  type="text"
                  value={img.altText || ''}
                  onChange={(e) => updateImage(img.id, 'altText', e.target.value)}
                  placeholder="Describe this image"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Caption</label>
                <input
                  type="text"
                  value={img.caption || ''}
                  onChange={(e) => updateImage(img.id, 'caption', e.target.value)}
                  placeholder="Image caption"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
