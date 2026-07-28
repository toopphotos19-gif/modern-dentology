'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminBadge } from '@/components/admin/ui/AdminBadge';
import { AdminModal } from '@/components/admin/ui/AdminModal';
import { showToast } from '@/components/admin/ui/AdminToast';
import { deleteMenu } from '@/app/admin/(dashboard)/menus/actions';
import { Plus, Pencil, Trash2, LayoutGrid, Users } from 'lucide-react';

type MenuItem = { id: string; label: string; href: string; group: string };
type MenuData = {
  id: string;
  name: string;
  description: string | null;
  items: MenuItem[];
  _count: { users: number };
};

export function MenuList({ menus }: { menus: MenuData[] }) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteMenu(deleteId);
      showToast({ type: 'success', title: 'Menu deleted' });
      setDeleteId(null);
    } catch (err) {
      showToast({ type: 'error', title: 'Error', description: String(err) });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Menu Management"
        description="Create custom admin menus and assign them to users for role-based access"
        actions={
          <Link href="/admin/menus/new">
            <AdminButton><Plus className="h-4 w-4 mr-1" /> Create Menu</AdminButton>
          </Link>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {menus.length === 0 ? (
          <div className="sm:col-span-2 lg:col-span-3 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 text-center">
            <LayoutGrid className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 mb-4">No menus created yet</p>
            <Link href="/admin/menus/new">
              <AdminButton><Plus className="h-4 w-4 mr-1" /> Create First Menu</AdminButton>
            </Link>
          </div>
        ) : (
          menus.map((menu) => {
            // Group items by group name
            const groups: Record<string, string[]> = {};
            menu.items.forEach((item) => {
              if (!groups[item.group]) groups[item.group] = [];
              groups[item.group].push(item.label);
            });

            return (
              <div
                key={menu.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-800 dark:text-white">{menu.name}</h3>
                      {menu.description && (
                        <p className="text-xs text-slate-400 mt-0.5">{menu.description}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Link href={`/admin/menus/${menu.id}`}>
                        <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 transition-colors">
                          <Pencil className="h-4 w-4" />
                        </button>
                      </Link>
                      <button
                        onClick={() => setDeleteId(menu.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-3">
                    <AdminBadge variant="info" size="sm">
                      <LayoutGrid className="h-3 w-3 mr-0.5" />
                      {menu.items.length} item{menu.items.length !== 1 ? 's' : ''}
                    </AdminBadge>
                    <AdminBadge variant={menu._count.users > 0 ? 'success' : 'default'} size="sm">
                      <Users className="h-3 w-3 mr-0.5" />
                      {menu._count.users} user{menu._count.users !== 1 ? 's' : ''}
                    </AdminBadge>
                  </div>
                </div>

                {/* Items preview */}
                <div className="px-5 py-3 space-y-2">
                  {Object.entries(groups).map(([group, labels]) => (
                    <div key={group}>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">{group}</p>
                      <div className="flex flex-wrap gap-1">
                        {labels.map((label) => (
                          <span key={label} className="inline-block rounded-md bg-slate-100 dark:bg-slate-700 px-2 py-0.5 text-xs text-slate-600 dark:text-slate-300">
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      <AdminModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Menu"
        description="Users assigned to this menu will lose their access. Make sure to reassign them first."
      >
        <div className="flex gap-2 mt-4">
          <AdminButton variant="ghost" onClick={() => setDeleteId(null)}>Cancel</AdminButton>
          <AdminButton variant="danger" loading={deleting} onClick={handleDelete}>Delete Menu</AdminButton>
        </div>
      </AdminModal>
    </div>
  );
}
