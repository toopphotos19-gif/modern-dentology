'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Stethoscope, Cpu, Users, Star, FileText,
  Images, HelpCircle, Calendar, Briefcase, MessageSquare, Settings, LogOut, Menu, X
} from 'lucide-react';

const NAV = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Services', href: '/admin/services', icon: Stethoscope },
  { label: 'Technology', href: '/admin/technology', icon: Cpu },
  { label: 'Doctors', href: '/admin/doctors', icon: Users },
  { label: 'Testimonials', href: '/admin/testimonials', icon: Star },
  { label: 'Blog', href: '/admin/blog', icon: FileText },
  { label: 'Gallery', href: '/admin/gallery', icon: Images },
  { label: 'FAQ', href: '/admin/faq', icon: HelpCircle },
  { label: 'Bookings', href: '/admin/bookings', icon: Calendar },
  { label: 'Careers', href: '/admin/careers', icon: Briefcase },
  { label: 'Jobs', href: '/admin/jobs', icon: Briefcase },
  { label: 'Leads', href: '/admin/leads', icon: MessageSquare },
  { label: 'Site Settings', href: '/admin/settings', icon: Settings }
];

export function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on mobile when navigating
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="flex h-16 items-center justify-between bg-brand-900 px-4 text-white lg:hidden">
        <span className="text-lg font-bold">Modern Dentology</span>
        <button onClick={() => setOpen(!open)} aria-label="Toggle menu" className="p-2">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-brand-900 p-4 text-white/80 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-6 hidden px-2 text-lg font-bold text-white lg:block">
          Modern Dentology
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <nav className="flex-1 space-y-1">
            {NAV.map((n) => {
              const isActive = pathname === n.href;
              return (
                <Link 
                  key={n.href} 
                  href={n.href} 
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${isActive ? 'bg-brand-500 text-white' : 'hover:bg-white/10 hover:text-white'}`}
                >
                  <n.icon className="h-4 w-4" /> {n.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="pt-4 mt-auto">
          <Link href="/api/auth/signout" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-white/10 hover:text-white transition-colors">
            <LogOut className="h-4 w-4" /> Sign Out
          </Link>
        </div>
      </aside>
    </>
  );
}
