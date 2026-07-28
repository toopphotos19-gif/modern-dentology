'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminInput } from '@/components/admin/ui/AdminInput';
import { AdminTextarea } from '@/components/admin/ui/AdminTextarea';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { showToast } from '@/components/admin/ui/AdminToast';
import { saveMenu } from '@/app/admin/(dashboard)/menus/actions';
import {
  LayoutDashboard, Stethoscope, Cpu, Users, Star, FileText,
  Images, HelpCircle, Calendar, Briefcase, MessageSquare, Settings,
  Layers, SplitSquareVertical, FolderOpen, Info, Shield, LayoutGrid,
  Newspaper
} from 'lucide-react';

// All possible admin sections that can be added to a menu
const ALL_SECTIONS = [
  { group: 'Overview', label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
  { group: 'Content', label: 'Services', href: '/admin/services', icon: 'Stethoscope' },
  { group: 'Content', label: 'Doctors', href: '/admin/doctors', icon: 'Users' },
  { group: 'Content', label: 'Technology', href: '/admin/technology', icon: 'Cpu' },
  { group: 'Content', label: 'Blog Posts', href: '/admin/blog', icon: 'FileText' },
  { group: 'Content', label: 'Testimonials', href: '/admin/testimonials', icon: 'Star' },
  { group: 'Content', label: 'Before & After', href: '/admin/before-after', icon: 'SplitSquareVertical' },
  { group: 'Content', label: 'Gallery', href: '/admin/gallery', icon: 'Images' },
  { group: 'Content', label: 'FAQ', href: '/admin/faq', icon: 'HelpCircle' },
  { group: 'Pages', label: 'About Page', href: '/admin/about', icon: 'Info' },
  { group: 'Pages', label: 'Page Builder', href: '/admin/pages', icon: 'Layers' },
  { group: 'Management', label: 'Bookings', href: '/admin/bookings', icon: 'Calendar' },
  { group: 'Management', label: 'Leads / CRM', href: '/admin/leads', icon: 'MessageSquare' },
  { group: 'Management', label: 'Careers', href: '/admin/careers', icon: 'Briefcase' },
  { group: 'Management', label: 'Jobs', href: '/admin/jobs', icon: 'Briefcase' },
  { group: 'Media & SEO', label: 'Media Library', href: '/admin/media', icon: 'FolderOpen' },
  { group: 'System', label: 'Website Settings', href: '/admin/settings', icon: 'Settings' },
];

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard, Stethoscope, Cpu, Users, Star, FileText,
  Images, HelpCircle, Calendar, Briefcase, MessageSquare, Settings,
  Layers, SplitSquareVertical, FolderOpen, Info, Shield, LayoutGrid,
  Newspaper,
};

type MenuItemData = {
  label: string;
  href: string;
  icon: string;
  group: string;
  order: number;
};

type ExistingMenu = {
  id: string;
  name: string;
  description: string | null;
  items: { label: string; href: string; icon: string | null; group: string; order: number }[];
};

export function MenuForm({ menu }: { menu?: ExistingMenu }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(menu?.name || '');
  const [description, setDescription] = useState(menu?.description || '');

  // Initialize selected items from existing menu
  const existingHrefs = new Set(menu?.items.map((i) => i.href) || []);
  const [selectedHrefs, setSelectedHrefs] = useState<Set<string>>(existingHrefs);

  function toggleSection(href: string) {
    setSelectedHrefs((prev) => {
      const next = new Set(prev);
      if (next.has(href)) next.delete(href);
      else next.add(href);
      return next;
    });
  }

  function selectAll() {
    setSelectedHrefs(new Set(ALL_SECTIONS.map((s) => s.href)));
  }

  function selectNone() {
    setSelectedHrefs(new Set());
  }

  // Group sections for display
  const groups: Record<string, typeof ALL_SECTIONS> = {};
  ALL_SECTIONS.forEach((section) => {
    if (!groups[section.group]) groups[section.group] = [];
    groups[section.group].push(section);
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      showToast({ type: 'error', title: 'Menu name is required' });
      return;
    }
    if (selectedHrefs.size === 0) {
      showToast({ type: 'error', title: 'Select at least one section' });
      return;
    }

    setSaving(true);
    try {
      const items: MenuItemData[] = [];
      let order = 0;
      ALL_SECTIONS.forEach((section) => {
        if (selectedHrefs.has(section.href)) {
          items.push({
            label: section.label,
            href: section.href,
            icon: section.icon,
            group: section.group,
            order: order++,
          });
        }
      });

      const fd = new FormData();
      if (menu?.id) fd.set('id', menu.id);
      fd.set('name', name);
      fd.set('description', description);
      fd.set('items', JSON.stringify(items));

      await saveMenu(fd);
      showToast({ type: 'success', title: menu ? 'Menu updated' : 'Menu created' });
      router.push('/admin/menus');
    } catch (err) {
      showToast({ type: 'error', title: 'Error', description: String(err) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Menu Info */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/80">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400">
            <LayoutGrid className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Menu Details</h3>
            <p className="text-xs text-slate-400">Name and description for this access menu</p>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <AdminInput
            label="Menu Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Full Access, Call Center, Content Team"
            required
          />
          <AdminTextarea
            label="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this menu for?"
            rows={2}
          />
        </div>
      </div>

      {/* Section Selection */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Admin Sections
                <span className="ml-2 text-xs font-normal text-brand-500">{selectedHrefs.size} selected</span>
              </h3>
              <p className="text-xs text-slate-400">Choose which pages users with this menu can access</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={selectAll} className="text-xs text-brand-500 hover:text-brand-600 font-medium transition-colors">
              Select All
            </button>
            <span className="text-slate-300">|</span>
            <button type="button" onClick={selectNone} className="text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors">
              Clear
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {Object.entries(groups).map(([groupName, sections]) => (
            <div key={groupName}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                {groupName}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {sections.map((section) => {
                  const isSelected = selectedHrefs.has(section.href);
                  const IconComp = ICON_MAP[section.icon] || LayoutDashboard;

                  return (
                    <label
                      key={section.href}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition-all border ${
                        isSelected
                          ? 'border-brand-300 bg-brand-50 dark:border-brand-700 dark:bg-brand-900/20 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSection(section.href)}
                        className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500"
                      />
                      <IconComp className={`h-4 w-4 flex-shrink-0 ${isSelected ? 'text-brand-500' : 'text-slate-400'}`} />
                      <span className={`text-sm font-medium ${isSelected ? 'text-brand-700 dark:text-brand-300' : 'text-slate-600 dark:text-slate-400'}`}>
                        {section.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <AdminButton type="submit" loading={saving}>
          {menu ? 'Update Menu' : 'Create Menu'}
        </AdminButton>
        <AdminButton type="button" variant="ghost" onClick={() => router.push('/admin/menus')}>
          Cancel
        </AdminButton>
      </div>
    </form>
  );
}
