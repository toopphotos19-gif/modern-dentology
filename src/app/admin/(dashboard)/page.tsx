import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import {
  Stethoscope, Users, Cpu, Calendar, MessageSquare, Briefcase,
  Star, FileText, Images, TrendingUp, Clock, Activity, ArrowUpRight, Plus
} from 'lucide-react';
import { DashboardCharts } from '@/components/admin/DashboardCharts';

export const dynamic = 'force-dynamic';

export default async function AdminHome() {
  const [
    serviceCount, doctorCount, techCount,
    totalBookings, pendingBookings, applicationCount,
    testimonialCount, blogCount, galleryCount, leadCount,
    recentBookings, recentActivities
  ] = await Promise.all([
    prisma.service.count(),
    prisma.doctor.count(),
    prisma.technology.count(),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: 'PENDING' } }),
    prisma.application.count(),
    prisma.testimonial.count(),
    prisma.blogPost.count(),
    prisma.galleryImage.count(),
    prisma.lead.count(),
    prisma.booking.findMany({ orderBy: { createdAt: 'desc' }, take: 5, include: { service: true } }),
    prisma.activityLog.findMany({ orderBy: { createdAt: 'desc' }, take: 8, include: { user: true } }).catch(() => []),
  ]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const statCards = [
    { label: 'Services', value: serviceCount, icon: Stethoscope, color: 'from-blue-500 to-blue-600', href: '/admin/services' },
    { label: 'Doctors', value: doctorCount, icon: Users, color: 'from-emerald-500 to-emerald-600', href: '/admin/doctors' },
    { label: 'Technologies', value: techCount, icon: Cpu, color: 'from-purple-500 to-purple-600', href: '/admin/technology' },
    { label: 'Bookings', value: totalBookings, icon: Calendar, color: 'from-amber-500 to-amber-600', href: '/admin/bookings', badge: pendingBookings > 0 ? `${pendingBookings} pending` : undefined },
    { label: 'Testimonials', value: testimonialCount, icon: Star, color: 'from-pink-500 to-pink-600', href: '/admin/testimonials' },
    { label: 'Blog Posts', value: blogCount, icon: FileText, color: 'from-indigo-500 to-indigo-600', href: '/admin/blog' },
    { label: 'Leads', value: leadCount, icon: MessageSquare, color: 'from-teal-500 to-teal-600', href: '/admin/leads' },
    { label: 'Applications', value: applicationCount, icon: Briefcase, color: 'from-orange-500 to-orange-600', href: '/admin/careers' },
  ];

  const quickActions = [
    { label: 'New Service', href: '/admin/services/new', icon: Stethoscope },
    { label: 'New Blog Post', href: '/admin/blog/new', icon: FileText },
    { label: 'Add Doctor', href: '/admin/doctors/new', icon: Users },
    { label: 'Upload Media', href: '/admin/media', icon: Images },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white animate-admin-fade-in">
            {greeting} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 animate-admin-fade-in" style={{ animationDelay: '0.1s' }}>
            Here&apos;s what&apos;s happening with your dental clinic today.
          </p>
        </div>
        <div className="flex gap-2 animate-admin-fade-in" style={{ animationDelay: '0.2s' }}>
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <action.icon className="h-4 w-4 text-brand-500" />
              <span className="hidden lg:inline">{action.label}</span>
              <Plus className="h-3 w-3 lg:hidden" />
            </Link>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            {/* Gradient Accent */}
            <div className={`absolute top-0 right-0 h-24 w-24 rounded-bl-[60px] bg-gradient-to-br ${card.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
            
            <div className="flex items-start justify-between relative">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white animate-admin-count-up">
                  {card.value}
                </p>
                {card.badge && (
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-400">
                    <Clock className="h-2.5 w-2.5" /> {card.badge}
                  </span>
                )}
              </div>
              <div className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${card.color} text-white shadow-lg`}>
                <card.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="h-3 w-3" />
              <span>View all</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts Section */}
      <DashboardCharts />

      {/* Recent Activity & Bookings */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Bookings */}
        <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-brand-500" /> Recent Bookings
            </h2>
            <Link href="/admin/bookings" className="text-xs text-brand-500 hover:text-brand-600 font-medium">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {recentBookings.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400 dark:text-slate-500">No bookings yet</p>
            ) : (
              recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-700/50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{booking.name}</p>
                    <p className="text-xs text-slate-400">{booking.service?.name || 'General'} · {new Date(booking.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    booking.status === 'PENDING' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                    booking.status === 'APPROVED' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                    'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-brand-500" /> Recent Activity
            </h2>
          </div>
          <div className="space-y-0">
            {recentActivities.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400 dark:text-slate-500">No activity recorded yet</p>
            ) : (
              recentActivities.map((activity, idx) => (
                <div key={activity.id} className="flex gap-3 py-2.5">
                  <div className="flex flex-col items-center">
                    <div className={`h-2 w-2 rounded-full mt-1.5 flex-shrink-0 ${
                      activity.action === 'created' ? 'bg-emerald-500' :
                      activity.action === 'updated' ? 'bg-blue-500' :
                      activity.action === 'deleted' ? 'bg-red-500' : 'bg-slate-400'
                    }`} />
                    {idx < recentActivities.length - 1 && <div className="w-px flex-1 bg-slate-200 dark:bg-slate-700 mt-1" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      <span className="font-medium">{activity.user?.name || 'Admin'}</span>{' '}
                      {activity.action}{' '}
                      <span className="font-medium">{activity.module}</span>
                      {activity.entityTitle && <>: <span className="text-brand-500">{activity.entityTitle}</span></>}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
