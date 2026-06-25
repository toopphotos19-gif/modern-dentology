'use client';

import { useState } from 'react';
import { UploadField } from '@/components/admin/UploadField';
import { saveSettings } from '@/app/admin/(dashboard)/settings/actions';

type S = Record<string, any> | null;

export function SettingsForm({ settings }: { settings: S }) {
  const [heroImage, setHeroImage] = useState((settings?.heroImage as string) || '');
  const [saved, setSaved] = useState(false);

  return (
    <form
      action={async (fd) => { fd.set('heroImage', heroImage); await saveSettings(fd); setSaved(true); }}
      className="max-w-2xl space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100"
    >
      <h2 className="font-semibold text-brand-900">Hero Section</h2>
      <F name="heroTitle" label="Hero Title" d={settings?.heroTitle} />
      <F name="heroSubtitle" label="Hero Subtitle" d={settings?.heroSubtitle} />
      <F name="heroDesc" label="Hero Description" d={settings?.heroDesc} />
      <UploadField label="Hero Background Image" value={heroImage} onChange={setHeroImage} />
      <F name="heroVideo" label="Hero Video URL (optional)" d={settings?.heroVideo} />
      <div className="grid grid-cols-2 gap-4">
        <F name="heroBtn1Text" label="Button 1 Text" d={settings?.heroBtn1Text} />
        <F name="heroBtn1Link" label="Button 1 Link" d={settings?.heroBtn1Link} />
        <F name="heroBtn2Text" label="Button 2 Text" d={settings?.heroBtn2Text} />
        <F name="heroBtn2Link" label="Button 2 Link" d={settings?.heroBtn2Link} />
      </div>

      <h2 className="pt-4 font-semibold text-brand-900">Contact & Social</h2>
      <F name="phone" label="Phone" d={settings?.phone} />
      <F name="email" label="Email" d={settings?.email} />
      <F name="address" label="Address" d={settings?.address} />
      <F name="facebook" label="Facebook URL" d={settings?.facebook} />
      <F name="instagram" label="Instagram URL" d={settings?.instagram} />
      <F name="youtube" label="YouTube URL" d={settings?.youtube} />

      <h2 className="pt-4 font-semibold text-brand-900">Default SEO</h2>
      <F name="metaTitle" label="Meta Title" d={settings?.metaTitle} />
      <F name="metaDesc" label="Meta Description" d={settings?.metaDesc} />

      <button className="rounded-lg bg-brand-500 px-5 py-2.5 font-semibold text-white hover:bg-brand-600">Save Settings</button>
      {saved && <span className="ml-3 text-sm text-green-600">Saved!</span>}
    </form>
  );
}

function F({ name, label, d }: { name: string; label: string; d?: string | null }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <input name={name} defaultValue={d || ''} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
    </div>
  );
}
