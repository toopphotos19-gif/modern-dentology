'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { SITE } from '@/lib/site';

const NAV = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Doctors', href: '/doctors' },
  { label: 'Technology', href: '/technology' },
  { label: 'Blog', href: '/blog' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' }
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
        scrolled ? 'bg-white/90 shadow-md backdrop-blur' : 'bg-transparent'
      }`}
    >
      <Container className="flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500 font-bold text-white">M</span>
          <span className={`text-xl font-bold ${scrolled ? 'text-brand-900' : 'text-white'}`}>{SITE.name}</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className={`text-sm font-medium transition-colors hover:text-brand-500 ${scrolled ? 'text-slate-700' : 'text-white/90'}`}>
              {item.label}
            </Link>
          ))}
          <Link href="/appointment" className="rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-600">
            Book Now
          </Link>
        </nav>

        <button className={`lg:hidden ${scrolled ? 'text-brand-900' : 'text-white'}`} onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </Container>

      {open && (
        <div className="bg-white px-4 pb-4 shadow-lg lg:hidden">
          {NAV.map((item) => (
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
