'use client';

import React from 'react';

export default function ClientSelectSubmit({ name, value, options }: { name: string; value: string; options: string[] }) {
  return (
    <form>
      <select name={name} defaultValue={value} onChange={(e) => e.currentTarget.form?.requestSubmit()} className="rounded border border-slate-300 px-2 py-1">
        {options.map((s) => (<option key={s} value={s}>{s}</option>))}
      </select>
    </form>
  );
}
