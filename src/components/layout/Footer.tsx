import Link from 'next/link';
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SITE } from '@/lib/site';

export function Footer({
  phone,
  email,
  address
}: {
  phone?: string | null;
  email?: string | null;
  address?: string | null;
}) {
  return (
    <footer className="bg-brand-900 text-white/80">
      <Container className="grid gap-10 py-16 md:grid-cols-4">
        <div>
          <h3 className="mb-3 text-xl font-bold text-white">{SITE.name}</h3>
          <p className="text-sm">{SITE.tagline}. Modern dentistry with a gentle touch.</p>
          <div className="mt-4 flex gap-3">
            <Link href="#" aria-label="Facebook"><Facebook className="h-5 w-5 hover:text-white" /></Link>
            <Link href="#" aria-label="Instagram"><Instagram className="h-5 w-5 hover:text-white" /></Link>
            <Link href="#" aria-label="YouTube"><Youtube className="h-5 w-5 hover:text-white" /></Link>
          </div>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-white">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/services" className="hover:text-white">Services</Link></li>
            <li><Link href="/doctors" className="hover:text-white">Doctors</Link></li>
            <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
            <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-white">More</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/technology" className="hover:text-white">Technology</Link></li>
            <li><Link href="/testimonials" className="hover:text-white">Testimonials</Link></li>
            <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
            <li><Link href="/gallery" className="hover:text-white">Gallery</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-white">Contact</h4>
          <ul className="space-y-3 text-sm">
            {phone && <li className="flex gap-2"><Phone className="h-4 w-4" /> {phone}</li>}
            {email && <li className="flex gap-2"><Mail className="h-4 w-4" /> {email}</li>}
            {address && <li className="flex gap-2"><MapPin className="h-4 w-4" /> {address}</li>}
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/10 py-6 text-center text-sm">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved.
      </div>
    </footer>
  );
}
