/**
 * Seed script: Creates default admin menus and upgrades the existing admin user to SUPER_ADMIN.
 *
 * Usage: npx tsx prisma/seed-rbac.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const FULL_ACCESS_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard', group: 'Overview', order: 0 },
  { label: 'Services', href: '/admin/services', icon: 'Stethoscope', group: 'Content', order: 1 },
  { label: 'Doctors', href: '/admin/doctors', icon: 'Users', group: 'Content', order: 2 },
  { label: 'Technology', href: '/admin/technology', icon: 'Cpu', group: 'Content', order: 3 },
  { label: 'Blog Posts', href: '/admin/blog', icon: 'FileText', group: 'Content', order: 4 },
  { label: 'Testimonials', href: '/admin/testimonials', icon: 'Star', group: 'Content', order: 5 },
  { label: 'Before & After', href: '/admin/before-after', icon: 'SplitSquareVertical', group: 'Content', order: 6 },
  { label: 'Gallery', href: '/admin/gallery', icon: 'Images', group: 'Content', order: 7 },
  { label: 'FAQ', href: '/admin/faq', icon: 'HelpCircle', group: 'Content', order: 8 },
  { label: 'About Page', href: '/admin/about', icon: 'Info', group: 'Pages', order: 9 },
  { label: 'Page Builder', href: '/admin/pages', icon: 'Layers', group: 'Pages', order: 10 },
  { label: 'Bookings', href: '/admin/bookings', icon: 'Calendar', group: 'Management', order: 11 },
  { label: 'Leads / CRM', href: '/admin/leads', icon: 'MessageSquare', group: 'Management', order: 12 },
  { label: 'Careers', href: '/admin/careers', icon: 'Briefcase', group: 'Management', order: 13 },
  { label: 'Jobs', href: '/admin/jobs', icon: 'Briefcase', group: 'Management', order: 14 },
  { label: 'Media Library', href: '/admin/media', icon: 'FolderOpen', group: 'Media & SEO', order: 15 },
  { label: 'Website Settings', href: '/admin/settings', icon: 'Settings', group: 'System', order: 16 },
];

const CALL_CENTER_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard', group: 'Overview', order: 0 },
  { label: 'Bookings', href: '/admin/bookings', icon: 'Calendar', group: 'Management', order: 1 },
  { label: 'Leads / CRM', href: '/admin/leads', icon: 'MessageSquare', group: 'Management', order: 2 },
];

async function main() {
  console.log('🔐 Seeding RBAC data...\n');

  // 1. Create "Full Access" menu (or skip if exists)
  let fullMenu = await prisma.adminMenu.findUnique({ where: { name: 'Full Access' } });
  if (!fullMenu) {
    fullMenu = await prisma.adminMenu.create({
      data: {
        name: 'Full Access',
        description: 'Complete access to all admin sections',
        items: { create: FULL_ACCESS_ITEMS },
      },
    });
    console.log('✅ Created "Full Access" menu with', FULL_ACCESS_ITEMS.length, 'items');
  } else {
    console.log('⏭️  "Full Access" menu already exists');
  }

  // 2. Create "Call Center" menu (or skip if exists)
  let callCenterMenu = await prisma.adminMenu.findUnique({ where: { name: 'Call Center' } });
  if (!callCenterMenu) {
    callCenterMenu = await prisma.adminMenu.create({
      data: {
        name: 'Call Center',
        description: 'Limited access for call center staff — bookings and leads only',
        items: { create: CALL_CENTER_ITEMS },
      },
    });
    console.log('✅ Created "Call Center" menu with', CALL_CENTER_ITEMS.length, 'items');
  } else {
    console.log('⏭️  "Call Center" menu already exists');
  }

  // 3. Upgrade existing admin user to SUPER_ADMIN
  const adminEmail = process.env.ADMIN_EMAIL || 'junaid@admin.com';
  const existingUser = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (existingUser) {
    await prisma.user.update({
      where: { email: adminEmail },
      data: {
        role: 'SUPER_ADMIN',
        enabled: true,
      },
    });
    console.log(`✅ Upgraded "${adminEmail}" to SUPER_ADMIN`);
  } else {
    console.log(`⚠️  User "${adminEmail}" not found — skipping role upgrade`);
  }

  console.log('\n🎉 RBAC seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
