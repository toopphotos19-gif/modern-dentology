import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';

// Generic admin list table with add/edit/delete.
export function CrudList({
  title,
  basePath,
  columns,
  rows,
  onDelete
}: {
  title: string;
  basePath: string;
  columns: { key: string; label: string }[];
  rows: Record<string, unknown>[];
  onDelete: (id: string) => Promise<void>;
}) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-900">{title}</h1>
        <Link href={`${basePath}/new`} className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600">
          <Plus className="h-4 w-4" /> Add
        </Link>
      </div>
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              {columns.map((c) => (<th key={c.key} className="px-5 py-3">{c.label}</th>))}
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id as string} className="border-t border-slate-100">
                {columns.map((c) => (<td key={c.key} className="px-5 py-3">{String(r[c.key] ?? '')}</td>))}
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <Link href={`${basePath}/${r.id}`} className="rounded p-2 hover:bg-slate-100"><Pencil className="h-4 w-4" /></Link>
                    <form action={async () => { 'use server'; await onDelete(r.id as string); }}>
                      <button className="rounded p-2 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (<tr><td colSpan={columns.length + 1} className="px-5 py-8 text-center text-slate-400">Nothing here yet. Click “Add”.</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
