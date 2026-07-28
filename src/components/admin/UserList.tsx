'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminBadge } from '@/components/admin/ui/AdminBadge';
import { AdminModal } from '@/components/admin/ui/AdminModal';
import { showToast } from '@/components/admin/ui/AdminToast';
import { deleteUser, toggleUserEnabled } from '@/app/admin/(dashboard)/users/actions';
import { Plus, Pencil, Trash2, Shield, ShieldCheck, ShieldAlert } from 'lucide-react';

type UserItem = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  enabled: boolean;
  menuId: string | null;
  menu: { id: string; name: string } | null;
  createdAt: string;
};

type MenuOption = { id: string; name: string };

const ROLE_CONFIG: Record<string, { label: string; color: 'danger' | 'warning' | 'success'; icon: React.ElementType }> = {
  SUPER_ADMIN: { label: 'Super Admin', color: 'danger', icon: ShieldAlert },
  ADMIN: { label: 'Admin', color: 'warning', icon: ShieldCheck },
  STAFF: { label: 'Staff', color: 'success', icon: Shield },
};

export function UserList({ users, menus }: { users: UserItem[]; menus: MenuOption[] }) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteUser(deleteId);
      showToast({ type: 'success', title: 'User deleted' });
      setDeleteId(null);
    } catch (err) {
      showToast({ type: 'error', title: 'Error', description: String(err) });
    } finally {
      setDeleting(false);
    }
  }

  async function handleToggle(id: string, enabled: boolean) {
    try {
      await toggleUserEnabled(id, enabled);
      showToast({ type: 'success', title: enabled ? 'User enabled' : 'User disabled' });
    } catch (err) {
      showToast({ type: 'error', title: 'Error', description: String(err) });
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="User Management"
        description="Create and manage admin panel users and their access permissions"
        actions={
          <Link href="/admin/users/new">
            <AdminButton><Plus className="h-4 w-4 mr-1" /> Add User</AdminButton>
          </Link>
        }
      />

      <div className="mt-6 space-y-3">
        {users.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 text-center">
            <Shield className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 mb-4">No users created yet</p>
            <Link href="/admin/users/new">
              <AdminButton><Plus className="h-4 w-4 mr-1" /> Create First User</AdminButton>
            </Link>
          </div>
        ) : (
          users.map((user) => {
            const roleInfo = ROLE_CONFIG[user.role] || ROLE_CONFIG.STAFF;
            const RoleIcon = roleInfo.icon;

            return (
              <div
                key={user.id}
                className={`rounded-2xl border bg-white dark:bg-slate-800/50 overflow-hidden transition-all ${
                  user.enabled
                    ? 'border-slate-200 dark:border-slate-700'
                    : 'border-red-200 dark:border-red-900/30 opacity-60'
                }`}
              >
                <div className="flex items-center gap-4 px-5 py-4">
                  {/* Avatar */}
                  <div className={`grid h-11 w-11 place-items-center rounded-full text-sm font-bold text-white flex-shrink-0 ${
                    user.role === 'SUPER_ADMIN'
                      ? 'bg-gradient-to-br from-red-400 to-red-600'
                      : user.role === 'ADMIN'
                        ? 'bg-gradient-to-br from-amber-400 to-amber-600'
                        : 'bg-gradient-to-br from-brand-400 to-brand-600'
                  }`}>
                    {(user.name || user.email).charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {user.name || 'Unnamed User'}
                      </p>
                      <AdminBadge variant={roleInfo.color} size="sm">
                        <RoleIcon className="h-3 w-3 mr-0.5" />
                        {roleInfo.label}
                      </AdminBadge>
                      {!user.enabled && (
                        <AdminBadge variant="danger" size="sm">Disabled</AdminBadge>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{user.email}</p>
                    {user.menu && (
                      <p className="text-xs text-brand-500 mt-0.5">Menu: {user.menu.name}</p>
                    )}
                    {!user.menu && user.role !== 'SUPER_ADMIN' && (
                      <p className="text-xs text-amber-500 mt-0.5">⚠ No menu assigned</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggle(user.id, !user.enabled)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        user.enabled
                          ? 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400'
                      }`}
                    >
                      {user.enabled ? 'Active' : 'Disabled'}
                    </button>
                    <Link href={`/admin/users/${user.id}`}>
                      <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300 transition-colors">
                        <Pencil className="h-4 w-4" />
                      </button>
                    </Link>
                    <button
                      onClick={() => setDeleteId(user.id)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AdminModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete User"
        description="This action cannot be undone. The user will permanently lose access."
      >
        <div className="flex gap-2 mt-4">
          <AdminButton variant="ghost" onClick={() => setDeleteId(null)}>Cancel</AdminButton>
          <AdminButton variant="danger" loading={deleting} onClick={handleDelete}>Delete User</AdminButton>
        </div>
      </AdminModal>
    </div>
  );
}
