import Link from 'next/link';
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react';
import { Container } from '@/components/ui/Container';

export function Footer({
  siteName = 'Premium Dental',
  tagline = 'Modern dentistry with a gentle touch.',
  copyright = 'All rights reserved.',
  phone,
  email,
  address,
  logo,
  socialLinks = [],
  footerMenu = [],
}: {
  siteName?: string | null;
  tagline?: string | null;
  copyright?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  logo?: string | null;
  socialLinks?: { platform: string; url: string }[];
  footerMenu?: { heading: string; links: { label: string; href: string }[] }[];
}) {
  const getIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return <Facebook className="h-5 w-5 hover:text-white" />;
      case 'instagram': return <Instagram className="h-5 w-5 hover:text-white" />;
      case 'youtube': return <Youtube className="h-5 w-5 hover:text-white" />;
      default: return null;
    }
  };

  return (
    <footer className="bg-brand-900 text-white/80">
      <Container className="grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-1 lg:col-span-2">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt={siteName || 'Footer Logo'} className="h-12 object-contain mb-4" />
          ) : (
            <h3 className="mb-3 text-xl font-bold text-white">{siteName}</h3>
          )}
          <p className="text-sm max-w-sm">{tagline}</p>
          <div className="mt-6 flex gap-3">
            {socialLinks.map((social, i) => (
              <Link key={i} href={social.url} aria-label={social.platform}>
                {getIcon(social.platform)}
              </Link>
            ))}
          </div>
        </div>
        
        {footerMenu && footerMenu.length > 0 ? (
          footerMenu.map((column, i) => (
            <div key={i}>
              <h4 className="mb-3 font-semibold text-white">{column.heading}</h4>
              <ul className="space-y-2 text-sm">
                {column.links.map((link, j) => (
                  <li key={j}><Link href={link.href} className="hover:text-white">{link.label}</Link></li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <>
            <div>
              <h4 className="mb-3 font-semibold text-white">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/services" className="hover:text-white">Services</Link></li>
                <li><Link href="/doctors" className="hover:text-white">Doctors</Link></li>
              </ul>
            </div>
          </>
        )}
        
        <div>
          <h4 className="mb-3 font-semibold text-white">Contact</h4>
          <ul className="space-y-3 text-sm">
            {phone && <li className="flex gap-2"><Phone className="h-4 w-4 shrink-0" /> <span>{phone}</span></li>}
            {email && <li className="flex gap-2"><Mail className="h-4 w-4 shrink-0" /> <span>{email}</span></li>}
            {address && <li className="flex gap-2"><MapPin className="h-4 w-4 shrink-0" /> <span>{address}</span></li>}
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/10 py-6 text-center text-sm">
        © {new Date().getFullYear()} {siteName}. {copyright}
      </div>
    </footer>
  );
}
