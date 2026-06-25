import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Seeds the admin user, default site settings, and sample TEXT content for
// Modern Dentology. NO images are seeded — every image field is left blank so
// the admin uploads all images from the dashboard. Safe to re-run (upserts).
async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'changeme123';
  const hash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: 'Administrator', password: hash, role: 'ADMIN' }
  });

  await prisma.siteSetting.upsert({
    where: { id: 'main' },
    update: {},
    create: {
      id: 'main',
      heroTitle: 'Your Smile, Perfected',
      heroSubtitle: 'Modern Dentology',
      heroDesc: 'World-class dentistry with cutting-edge technology and a gentle touch, led by Dr. Abdul Basit.',
      heroBtn1Text: 'Book Appointment',
      heroBtn1Link: '/appointment',
      heroBtn2Text: 'Our Services',
      heroBtn2Link: '/services',
      stats: [
        { label: 'Happy Patients', value: '12000+' },
        { label: 'Years Experience', value: '18' },
        { label: 'Expert Dentists', value: '9' },
        { label: 'Awards Won', value: '24' }
      ],
      phone: '+92 300 0000000',
      email: 'hello@moderndentology.com',
      address: '123 Smile Avenue',
      metaTitle: 'Modern Dentology | Premium Dental Clinic',
      metaDesc: 'Premium dental care with modern technology, led by Dr. Abdul Basit.'
    }
  });

  const services = [
    { slug: 'dental-implants', name: 'Dental Implants', shortDesc: 'Permanent, natural-looking tooth replacement.', benefits: ['Permanent solution', 'Natural look', 'Protects jawbone'] },
    { slug: 'root-canal', name: 'Root Canal', shortDesc: 'Painless treatment to save infected teeth.', benefits: ['Saves your tooth', 'Pain relief', 'Single visit options'] },
    { slug: 'veneers', name: 'Veneers', shortDesc: 'Transform your smile with custom veneers.', benefits: ['Instant smile makeover', 'Stain resistant', 'Natural finish'] },
    { slug: 'teeth-whitening', name: 'Teeth Whitening', shortDesc: 'Brighten your smile several shades.', benefits: ['Fast results', 'Safe & gentle', 'Long lasting'] }
  ];
  for (const [i, s] of services.entries()) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: { ...s, description: s.shortDesc + ' Our specialists deliver world-class results in a comfortable setting.', order: i + 1, enabled: true }
    });
  }

  const techs = [
    { slug: 'itero-scanner', name: 'iTero Scanner', shortDesc: 'Fast, accurate 3D digital impressions.' },
    { slug: 'cbct-scanner', name: 'CBCT Scanner', shortDesc: '3D imaging for precise diagnosis.' },
    { slug: 'digital-xray', name: 'Digital X-Ray', shortDesc: 'Low-radiation instant imaging.' }
  ];
  for (const [i, t] of techs.entries()) {
    await prisma.technology.upsert({
      where: { slug: t.slug },
      update: {},
      create: { ...t, description: t.shortDesc + ' Advanced equipment for better outcomes.', order: i + 1, enabled: true }
    });
  }

  const doctors = [
    { slug: 'dr-abdul-basit', name: 'Dr. Abdul Basit', qualification: 'BDS, Lead Dentist', experience: '15 years' },
    { slug: 'dr-sarah-lee', name: 'Dr. Sarah Lee', qualification: 'DDS, Orthodontics', experience: '12 years' },
    { slug: 'dr-emily-chen', name: 'Dr. Emily Chen', qualification: 'BDS, Cosmetic Dentistry', experience: '10 years' }
  ];
  for (const [i, d] of doctors.entries()) {
    await prisma.doctor.upsert({
      where: { slug: d.slug },
      update: {},
      create: { ...d, bio: 'A dedicated specialist committed to gentle, patient-first care.', specializations: [d.qualification], order: i + 1, enabled: true }
    });
  }

  const reviews = [
    { patientName: 'Michael R.', review: 'Best dental experience I have ever had. Painless and professional!', rating: 5 },
    { patientName: 'Olivia T.', review: 'My new veneers look amazing. The team is wonderful.', rating: 5 },
    { patientName: 'David K.', review: 'Modern clinic, friendly staff, and excellent results.', rating: 5 }
  ];
  for (const r of reviews) {
    const exists = await prisma.testimonial.findFirst({ where: { patientName: r.patientName } });
    if (!exists) await prisma.testimonial.create({ data: { ...r, enabled: true } });
  }

  console.log('Seed complete (no images seeded). Admin login:', email);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
