'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { ImageBox } from '@/components/ui/ImagePlaceholder';

export type Card = {
  title: string;
  desc: string;
  image?: string | null;
  href: string;
};

export function CardGrid({
  eyebrow,
  heading,
  cards,
  cta = 'Learn More'
}: {
  eyebrow: string;
  heading: string;
  cards: Card[];
  cta?: string;
}) {
  if (!cards.length) return null;
  return (
    <section className="py-24">
      <Container>
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-500">{eyebrow}</span>
          <h2 className="mt-2 text-3xl font-bold text-brand-900 sm:text-4xl">{heading}</h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="group overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-100 transition hover:-translate-y-2 hover:shadow-2xl">
              <div className="relative h-52 overflow-hidden">
                <ImageBox src={c.image} alt={c.title} className="transition duration-500 group-hover:scale-110" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-brand-900">{c.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">{c.desc}</p>
                <Link href={c.href} className="mt-4 inline-flex items-center gap-1 font-semibold text-brand-500 transition group-hover:gap-2">
                  {cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
