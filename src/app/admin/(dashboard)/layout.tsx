import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import {
  LayoutDashboard, Stethoscope, Cpu, Users, Star, FileText,
  Images, HelpCircle, Calendar, Briefcase, MessageSquare, Settings, LogOut
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

// Guard ONLY the protected dashboard pages. /admin/login is outside this group
// so it is never guarded (prevents the redirect loop).
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect('/admin/login');

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="hidden w-64 shrink-0 flex-col bg-brand-900 p-4 text-white/80 lg:flex">
        <div className="mb-6 px-2 text-lg font-bold text-white">Modern Dentology</div>
        <nav className="flex-1 space-y-1">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-white/10">
              <n.icon className="h-4 w-4" /> {n.label}
            </Link>
          ))}
        </nav>
        <Link href="/api/auth/signout" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-white/10">
          <LogOut className="h-4 w-4" /> Sign Out
        </Link>
      </aside>
      <main className="flex-1 p-6 lg:p-10">{children}</main>
    </div>
  );
}
