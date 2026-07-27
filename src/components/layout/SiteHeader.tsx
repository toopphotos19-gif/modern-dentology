import { prisma } from '@/lib/prisma';
import { Header } from './Header';
import { SITE } from '@/lib/site';

const DEFAULT_NAV = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Doctors', href: '/doctors' },
  { label: 'Technology', href: '/technology' },
  { label: 'Blog', href: '/blog' },
  { label: 'Before & After', href: '/before-after' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export async function SiteHeader() {
  const settings = await prisma.siteSetting.findUnique({ where: { id: 'main' } });

  // Normalize menu items: accept both "href" and "url" keys from the JSON data
  const rawMenu = settings?.headerMenu as any[] | null | undefined;
  const nav = Array.isArray(rawMenu) && rawMenu.length > 0
    ? rawMenu.map((item: any) => ({
        label: item.label || item.name || '',
        href: item.href || item.url || '/',
      }))
    : DEFAULT_NAV;

  return (
    <Header
      logo={settings?.headerLogo}
      siteName={settings?.websiteName || SITE.name}
      nav={nav}
    />
  );
}
