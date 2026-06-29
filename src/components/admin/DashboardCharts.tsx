'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Static demo data — in a full implementation this would come from server props
const bookingData = [
  { name: 'Mon', bookings: 4 },
  { name: 'Tue', bookings: 7 },
  { name: 'Wed', bookings: 5 },
  { name: 'Thu', bookings: 9 },
  { name: 'Fri', bookings: 11 },
  { name: 'Sat', bookings: 8 },
  { name: 'Sun', bookings: 3 },
];

const leadsData = [
  { name: 'Jan', leads: 12 },
  { name: 'Feb', leads: 19 },
  { name: 'Mar', leads: 15 },
  { name: 'Apr', leads: 22 },
  { name: 'May', leads: 28 },
  { name: 'Jun', leads: 35 },
];

export function DashboardCharts() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Bookings Chart */}
      <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
        <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Weekly Bookings</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bookingData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                }}
              />
              <Bar dataKey="bookings" fill="url(#bookingGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="bookingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06a6cc" />
                  <stop offset="100%" stopColor="#0784a8" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Leads Chart */}
      <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
        <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Leads Growth</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={leadsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                }}
              />
              <defs>
                <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="leads" stroke="#10b981" strokeWidth={2.5} fill="url(#leadsGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
