import { prisma } from '@/lib/prisma';
import { Header } from './Header';

export async function SiteHeader() {
  const settings = await prisma.siteSetting.findUnique({ where: { id: 'main' } });

  return (
    <Header
      logo={settings?.headerLogo}
      siteName={settings?.websiteName}
      nav={(settings?.headerMenu as any) || [
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: 'Doctors', href: '/doctors' },
        { label: 'Technology', href: '/technology' },
        { label: 'Blog', href: '/blog' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' }
      ]}
    />
  );
}
