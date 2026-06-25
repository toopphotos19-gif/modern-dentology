'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ImageBox } from '@/components/ui/ImagePlaceholder';

type HeroProps = {
  title?: string | null;
  subtitle?: string | null;
  desc?: string | null;
  image?: string | null;
  video?: string | null;
  btn1Text?: string | null;
  btn1Link?: string | null;
  btn2Text?: string | null;
  btn2Link?: string | null;
};

export function Hero(p: HeroProps) {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <div className="absolute inset-0">
        {p.video ? (
          <video autoPlay loop muted playsInline className="h-full w-full object-cover" src={p.video} />
        ) : (
          <ImageBox src={p.image} alt="" />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-brand-900/85 via-brand-900/60 to-transparent" />

      <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute right-24 top-32 hidden h-24 w-24 rounded-full bg-brand-400/30 blur-2xl lg:block" />
      <motion.div animate={{ y: [0, 25, 0] }} transition={{ duration: 8, repeat: Infinity }} className="absolute bottom-24 right-1/3 hidden h-32 w-32 rounded-full bg-brand-500/20 blur-3xl lg:block" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-brand-100 backdrop-blur">
            {p.subtitle}
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl font-extrabold leading-tight text-white sm:text-6xl">
            {p.title}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 text-lg text-white/80">
            {p.desc}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 flex flex-wrap gap-4">
            {p.btn1Text && (<Link href={p.btn1Link || '#'} className="rounded-full bg-brand-500 px-8 py-3.5 font-semibold text-white shadow-xl transition hover:scale-105 hover:bg-brand-600">{p.btn1Text}</Link>)}
            {p.btn2Text && (<Link href={p.btn2Link || '#'} className="rounded-full border border-white/40 px-8 py-3.5 font-semibold text-white transition hover:bg-white/10">{p.btn2Text}</Link>)}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
