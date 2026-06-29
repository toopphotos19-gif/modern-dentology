'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';

export function Header({
  logo,
  siteName = 'Premium Dental',
  nav = []
}: {
  logo?: string | null;
  siteName?: string | null;
  nav?: { label: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';
  const forceSolid = !isHome || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        forceSolid ? 'bg-white/90 shadow-md backdrop-blur' : 'bg-transparent'
      }`}
    >
      <Container className="flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt={siteName || 'Logo'} className="h-10 object-contain" />
          ) : (
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500 font-bold text-white">
              {siteName?.charAt(0) || 'D'}
            </span>
          )}
          {!logo && (
            <span className={`text-xl font-bold ${forceSolid ? 'text-brand-900' : 'text-white'}`}>
              {siteName}
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={`text-sm font-medium transition-colors hover:text-brand-500 ${forceSolid ? 'text-slate-700' : 'text-white/90'}`}>
              {item.label}
            </Link>
          ))}
          <Link href="/appointment" className="rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-600">
            Book Now
          </Link>
        </nav>

        <button className={`lg:hidden ${forceSolid ? 'text-brand-900' : 'text-white'}`} onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </Container>

      {open && (
        <div className="bg-white px-4 pb-4 shadow-lg lg:hidden">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="block border-b py-3 text-slate-700">
              {item.label}
            </Link>
          ))}
          <Link href="/appointment" onClick={() => setOpen(false)} className="mt-3 block rounded-full bg-brand-500 py-3 text-center font-semibold text-white">
            Book Now
          </Link>
        </div>
      )}
    </motion.header>
  );
}
