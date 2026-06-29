import { prisma } from '@/lib/prisma';
import { Footer } from './Footer';

export async function SiteFooter() {
  const settings = await prisma.siteSetting.findUnique({ where: { id: 'main' } });

  const socialLinks = [];
  if (settings?.facebook) socialLinks.push({ platform: 'facebook', url: settings.facebook });
  if (settings?.instagram) socialLinks.push({ platform: 'instagram', url: settings.instagram });
  if (settings?.youtube) socialLinks.push({ platform: 'youtube', url: settings.youtube });

  return (
    <Footer
      siteName={settings?.websiteName}
      tagline={settings?.tagline}
      copyright={settings?.copyrightText}
      phone={settings?.phone}
      email={settings?.email}
      address={settings?.address}
      logo={settings?.footerLogo || settings?.headerLogo}
      socialLinks={socialLinks}
      footerMenu={(settings?.footerColumns as any) || []}
    />
  );
}
