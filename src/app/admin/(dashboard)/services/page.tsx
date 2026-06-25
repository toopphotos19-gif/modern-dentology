import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { deleteService } from './actions';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminServices() {
  const services = await prisma.service.findMany({ orderBy: { order: 'asc' } });
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-900">Services</h1>
        <Link href="/admin/services/new" className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600">
          <Plus className="h-4 w-4" /> Add Service
        </Link>
      </div>
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Slug</th>
              <th className="px-5 py-3">Enabled</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id} className="border-t border-slate-100">
                <td className="px-5 py-3 font-medium">{s.name}</td>
                <td className="px-5 py-3 text-slate-500">{s.slug}</td>
                <td className="px-5 py-3">{s.enabled ? 'Yes' : 'No'}</td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/services/${s.id}`} className="rounded p-2 hover:bg-slate-100"><Pencil className="h-4 w-4" /></Link>
                    <form action={async () => { 'use server'; await deleteService(s.id); }}>
                      <button className="rounded p-2 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-8 text-center text-slate-400">No services yet. Click “Add Service”.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
