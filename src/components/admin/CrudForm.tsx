'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadField } from '@/components/admin/UploadField';

export type FieldDef = {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'textarea' | 'image' | 'checkbox';
};

// Generic admin form. Renders fields from a definition and submits to the
// provided server action. Image fields use the Cloudinary upload widget.
export function CrudForm({
  fields,
  action,
  initial,
  redirectTo
}: {
  fields: FieldDef[];
  action: (fd: FormData) => Promise<void>;
  initial?: Record<string, unknown>;
  redirectTo: string;
}) {
  const router = useRouter();
  const [images, setImages] = useState<Record<string, string>>(
    Object.fromEntries(
      fields.filter((f) => f.type === 'image').map((f) => [f.name, (initial?.[f.name] as string) || ''])
    )
  );

  return (
    <form
      action={async (fd) => {
        Object.entries(images).forEach(([k, v]) => fd.set(k, v));
        await action(fd);
        router.push(redirectTo);
      }}
      className="max-w-2xl space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100"
    >
      {initial?.id ? <input type="hidden" name="id" defaultValue={initial.id as string} /> : null}
      {fields.map((f) => {
        if (f.type === 'image') {
          return <UploadField key={f.name} label={f.label} value={images[f.name]} onChange={(url) => setImages((p) => ({ ...p, [f.name]: url }))} />;
        }
        if (f.type === 'textarea') {
          return (
            <div key={f.name}>
              <label className="mb-1 block text-sm font-medium text-slate-700">{f.label}</label>
              <textarea name={f.name} defaultValue={(initial?.[f.name] as string) || ''} rows={5} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </div>
          );
        }
        if (f.type === 'checkbox') {
          return (
            <label key={f.name} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name={f.name} defaultChecked={(initial?.[f.name] as boolean) ?? true} /> {f.label}
            </label>
          );
        }
        return (
          <div key={f.name}>
            <label className="mb-1 block text-sm font-medium text-slate-700">{f.label}</label>
            <input name={f.name} type={f.type || 'text'} defaultValue={(initial?.[f.name] as string) ?? ''} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </div>
        );
      })}
      <button className="rounded-lg bg-brand-500 px-5 py-2.5 font-semibold text-white hover:bg-brand-600">Save</button>
    </form>
  );
}
