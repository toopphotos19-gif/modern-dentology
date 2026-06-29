'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Stethoscope, Cpu, Users, Star, FileText,
  Images, HelpCircle, Calendar, Briefcase, MessageSquare, Settings,
  LogOut, Menu, X, ChevronDown, Search, Layers, SplitSquareVertical,
  FolderOpen, FileImage, Bell, Newspaper, Info
} from 'lucide-react';
import { clsx } from 'clsx';

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Content',
    items: [
      { label: 'Services', href: '/admin/services', icon: Stethoscope },
      { label: 'Doctors', href: '/admin/doctors', icon: Users },
      { label: 'Technology', href: '/admin/technology', icon: Cpu },
      { label: 'Blog Posts', href: '/admin/blog', icon: FileText },
      { label: 'Testimonials', href: '/admin/testimonials', icon: Star },
      { label: 'Before & After', href: '/admin/before-after', icon: SplitSquareVertical },
      { label: 'Gallery', href: '/admin/gallery', icon: Images },
      { label: 'FAQ', href: '/admin/faq', icon: HelpCircle },
    ],
  },
  {
    title: 'Pages',
    items: [
      { label: 'About Page', href: '/admin/about', icon: Info },
      { label: 'Page Builder', href: '/admin/pages', icon: Layers },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'Bookings', href: '/admin/bookings', icon: Calendar },
      { label: 'Leads / CRM', href: '/admin/leads', icon: MessageSquare },
      { label: 'Careers', href: '/admin/careers', icon: Briefcase },
      { label: 'Jobs', href: '/admin/jobs', icon: Briefcase },
    ],
  },
  {
    title: 'Media & SEO',
    items: [
      { label: 'Media Library', href: '/admin/media', icon: FolderOpen },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Website Settings', href: '/admin/settings', icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const pathname = usePathname();

  // Close mobile sidebar on navigation
  useEffect(() => { setOpen(false); }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [open]);

  function toggleGroup(title: string) {
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }));
  }

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* ── Mobile Top Bar ── */}
      <div className="flex h-16 items-center justify-between bg-slate-900 px-4 text-white lg:hidden">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 font-bold text-white text-sm shadow-lg shadow-brand-500/30">M</span>
          <span className="text-lg font-bold">Admin</span>
        </div>
        <button onClick={() => setOpen(!open)} aria-label="Toggle menu" className="p-2 rounded-lg hover:bg-white/10 transition">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* ── Mobile Backdrop ── */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-900 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-6 border-b border-white/5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 font-bold text-white text-sm shadow-lg shadow-brand-500/30">
            M
          </span>
          <div>
            <div className="text-sm font-bold text-white">Modern Dentology</div>
            <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">CMS Dashboard</div>
          </div>
        </div>

        {/* Search shortcut */}
        <div className="px-4 py-3">
          <button
            onClick={() => {
              // Trigger Cmd+K search
              document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
            }}
            className="flex w-full items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 text-sm text-slate-400 hover:bg-white/10 transition-colors group"
          >
            <Search className="h-4 w-4" />
            <span className="flex-1 text-left">Quick search...</span>
            <kbd className="hidden sm:inline-flex rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-500 group-hover:text-slate-400">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 pb-4 admin-scrollbar">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="mb-1">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group.title)}
                className="flex w-full items-center justify-between px-3 py-2 mt-4 mb-1"
              >
                <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">{group.title}</span>
                <ChevronDown
                  className={clsx(
                    'h-3 w-3 text-slate-600 transition-transform duration-200',
                    collapsed[group.title] && '-rotate-90'
                  )}
                />
              </button>

              {/* Group Items */}
              {!collapsed[group.title] && (
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={clsx(
                          'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 group relative',
                          active
                            ? 'bg-brand-500/15 text-brand-400 font-medium'
                            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                        )}
                      >
                        {active && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-brand-500" />
                        )}
                        <item.icon className={clsx('h-[18px] w-[18px] flex-shrink-0', active ? 'text-brand-400' : 'text-slate-500 group-hover:text-slate-300')} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-white/5 p-4">
          {/* User Profile */}
          <div className="flex items-center gap-3 rounded-xl px-3 py-2 mb-2">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-xs font-bold text-white">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Administrator</p>
              <p className="text-[11px] text-slate-500 truncate">admin@example.com</p>
            </div>
          </div>
          {/* Sign Out */}
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Sign Out
          </Link>
        </div>
      </aside>
    </>
  );
}
