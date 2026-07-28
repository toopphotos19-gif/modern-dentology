'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminInput } from '@/components/admin/ui/AdminInput';
import { AdminSelect } from '@/components/admin/ui/AdminSelect';
import { AdminToggle } from '@/components/admin/ui/AdminToggle';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { showToast } from '@/components/admin/ui/AdminToast';
import { createUser, updateUser } from '@/app/admin/(dashboard)/users/actions';
import { Mail, User, Lock, Shield } from 'lucide-react';

type MenuOption = { id: string; name: string };
type UserData = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  menuId: string | null;
  enabled: boolean;
};

export function UserForm({
  user,
  menus = [],
}: {
  user?: UserData;
  menus?: MenuOption[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [enabled, setEnabled] = useState(user?.enabled ?? true);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData(e.currentTarget);
      fd.set('enabled', enabled ? 'on' : '');
      if (user?.id) {
        fd.set('id', user.id);
        await updateUser(fd);
        showToast({ type: 'success', title: 'User updated', description: 'User account has been updated.' });
      } else {
        await createUser(fd);
        showToast({ type: 'success', title: 'User created', description: 'New user account has been created.' });
      }
      router.push('/admin/users');
    } catch (err) {
      showToast({ type: 'error', title: 'Error', description: String(err) });
    } finally {
      setSaving(false);
    }
  }

  const roleOptions = [
    { value: 'SUPER_ADMIN', label: '🔴 Super Admin — Full unrestricted access' },
    { value: 'ADMIN', label: '🟠 Admin — Uses assigned menu' },
    { value: 'STAFF', label: '🟢 Staff — Uses assigned menu (limited)' },
  ];

  const menuOptions = [
    { value: '', label: 'No menu assigned (no access)' },
    ...menus.map((m) => ({ value: m.id, label: m.name })),
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Account Info */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/80">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400">
            <User className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Account Information</h3>
            <p className="text-xs text-slate-400">Basic user details and login credentials</p>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminInput
              name="name"
              label="Full Name"
              defaultValue={user?.name || ''}
              placeholder="John Doe"
              icon={<User className="h-4 w-4" />}
            />
            <AdminInput
              name="email"
              label="Email Address"
              type="email"
              defaultValue={user?.email || ''}
              placeholder="user@example.com"
              required
              icon={<Mail className="h-4 w-4" />}
            />
          </div>
          <AdminInput
            name="password"
            label={user ? 'New Password (leave blank to keep current)' : 'Password'}
            type="password"
            placeholder={user ? '••••••••' : 'Minimum 6 characters'}
            required={!user}
            icon={<Lock className="h-4 w-4" />}
          />
          <AdminToggle
            label="Account Enabled"
            description="Disabled users cannot log in"
            checked={enabled}
            onChange={setEnabled}
          />
        </div>
      </div>

      {/* Permissions */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/80">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Role & Permissions</h3>
            <p className="text-xs text-slate-400">Control what this user can access</p>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <AdminSelect
            name="role"
            label="User Role"
            options={roleOptions}
            defaultValue={user?.role || 'STAFF'}
            helpText="Super Admins have full access regardless of menu. Admin & Staff use assigned menu."
          />
          <AdminSelect
            name="menuId"
            label="Assigned Menu"
            options={menuOptions}
            defaultValue={user?.menuId || ''}
            helpText="Select which admin sections this user can access. Only applies to Admin & Staff roles."
          />
          {menus.length === 0 && (
            <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3">
              <p className="text-sm text-amber-700 dark:text-amber-300">
                ⚠️ No menus created yet. <a href="/admin/menus/new" className="underline font-medium">Create a menu first</a> to assign permissions.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <AdminButton type="submit" loading={saving}>
          {user ? 'Update User' : 'Create User'}
        </AdminButton>
        <AdminButton type="button" variant="ghost" onClick={() => router.push('/admin/users')}>
          Cancel
        </AdminButton>
      </div>
    </form>
  );
}
