'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadField } from '@/components/admin/UploadField';
import { saveService } from '@/app/admin/(dashboard)/services/actions';

type Service = {
  id?: string;
  name?: string;
  slug?: string;
  shortDesc?: string;
  description?: string;
  image?: string | null;
  banner?: string | null;
  enabled?: boolean;
  order?: number;
  metaTitle?: string | null;
  metaDesc?: string | null;
};

export function ServiceForm({ service }: { service?: Service }) {
  const router = useRouter();
  const [image, setImage] = useState(service?.image || '');
  const [banner, setBanner] = useState(service?.banner || '');

  return (
    <form
      action={async (fd) => {
        fd.set('image', image);
        fd.set('banner', banner);
        await saveService(fd);
        router.push('/admin/services');
      }}
      className="max-w-2xl space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100"
    >
      {service?.id && <input type="hidden" name="id" defaultValue={service.id} />}
      <Field name="name" label="Service Name" defaultValue={service?.name} required />
      <Field name="slug" label="URL Slug (optional)" defaultValue={service?.slug} placeholder="auto from name" />
      <Field name="shortDesc" label="Short Description" defaultValue={service?.shortDesc} required />
      <Area name="description" label="Full Description" defaultValue={service?.description} />
      <UploadField label="Card Image" value={image} onChange={setImage} />
      <UploadField label="Banner Image" value={banner} onChange={setBanner} />
      <Field name="order" label="Display Order" type="number" defaultValue={String(service?.order ?? 0)} />
      <Field name="metaTitle" label="SEO Meta Title" defaultValue={service?.metaTitle || ''} />
      <Field name="metaDesc" label="SEO Meta Description" defaultValue={service?.metaDesc || ''} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="enabled" defaultChecked={service?.enabled ?? true} /> Enabled (visible on site)
      </label>
      <button className="rounded-lg bg-brand-500 px-5 py-2.5 font-semibold text-white hover:bg-brand-600">Save</button>
    </form>
  );
}

function Field({ name, label, ...rest }: { name: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <input name={name} {...rest} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
    </div>
  );
}

function Area({ name, label, defaultValue }: { name: string; label: string; defaultValue?: string }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <textarea name={name} defaultValue={defaultValue} rows={5} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
    </div>
  );
}
