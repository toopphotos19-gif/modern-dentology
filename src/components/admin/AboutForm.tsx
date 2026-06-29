'use client';

import { useState } from 'react';
import { UploadField } from '@/components/admin/UploadField';
import { saveAboutPage } from '@/app/admin/(dashboard)/about/actions';

export function AboutForm({ settings }: { settings: any }) {
  const [aboutImage, setAboutImage] = useState((settings?.aboutImage as string) || '');
  const [saved, setSaved] = useState(false);

  return (
    <form
      action={async (fd) => {
        fd.set('aboutImage', aboutImage);
        await saveAboutPage(fd);
        setSaved(true);
      }}
      className="max-w-2xl space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">About Text</label>
        <textarea name="aboutText" defaultValue={settings?.aboutText || ''} className="w-full rounded-lg border border-slate-300 px-3 py-2" rows={6} />
      </div>
      <UploadField label="About Image" value={aboutImage} onChange={setAboutImage} />

      <button className="rounded-lg bg-brand-500 px-5 py-2.5 font-semibold text-white hover:bg-brand-600">Save About Us</button>
      {saved && <span className="ml-3 text-sm text-green-600">Saved!</span>}
    </form>
  );
}
