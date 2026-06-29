import { prisma } from '@/lib/prisma';
import { Footer } from './Footer';
import { SITE } from '@/lib/site';

export async function SiteFooter() {
  const settings = await prisma.siteSetting.findUnique({ where: { id: 'main' } });

  const socialLinks = [];
  if (settings?.facebook) socialLinks.push({ platform: 'facebook', url: settings.facebook });
  if (settings?.instagram) socialLinks.push({ platform: 'instagram', url: settings.instagram });
  if (settings?.youtube) socialLinks.push({ platform: 'youtube', url: settings.youtube });

  const defaultFooterMenu = [
    {
      heading: "Quick Links",
      links: [
        { label: "Services", href: "/services" },
        { label: "Doctors", href: "/doctors" },
        { label: "Blog", href: "/blog" },
        { label: "Careers", href: "/careers" }
      ]
    },
    {
      heading: "More",
      links: [
        { label: "Technology", href: "/technology" },
        { label: "Testimonials", href: "/testimonials" },
        { label: "FAQ", href: "/faq" },
        { label: "Before & After", href: "/before-after" },
        { label: "Gallery", href: "/gallery" }
      ]
    }
  ];

  return (
    <Footer
      siteName={settings?.websiteName || SITE.name}
      tagline={settings?.tagline || SITE.tagline}
      copyright={settings?.copyrightText || 'All rights reserved.'}
      phone={settings?.phone}
      email={settings?.email}
      address={settings?.address}
      logo={settings?.footerLogo || settings?.headerLogo}
      socialLinks={socialLinks}
      footerMenu={(settings?.footerColumns as any) || defaultFooterMenu}
    />
  );
}
