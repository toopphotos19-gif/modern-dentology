'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';

// Reusable upload widget for the admin forms. Uploads to /api/upload and
// returns the resulting URL via onChange. Works for images, video, and PDFs.
export function UploadField({
  label,
  value,
  onChange,
  accept = 'image/*'
}: {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <div className="flex items-center gap-3">
        {value && accept.startsWith('image') && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-16 w-16 rounded object-cover" />
        )}
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
          <Upload className="h-4 w-4" />
          {loading ? 'Uploading...' : 'Upload'}
          <input type="file" accept={accept} className="hidden" onChange={handleFile} />
        </label>
      </div>
      {value && <p className="mt-1 break-all text-xs text-slate-400">{value}</p>}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
