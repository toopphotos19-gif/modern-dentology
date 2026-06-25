'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Container } from '@/components/ui/Container';

export type Review = { patientName: string; review: string; rating: number };

export function Testimonials({ reviews }: { reviews: Review[] }) {
  if (!reviews?.length) return null;
  return (
    <section className="bg-brand-50 py-24">
      <Container>
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-500">Testimonials</span>
          <h2 className="mt-2 text-3xl font-bold text-brand-900 sm:text-4xl">What Our Patients Say</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {reviews.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-2xl bg-white p-8 shadow-lg">
              <div className="mb-4 flex gap-1 text-amber-400">
                {Array.from({ length: r.rating }).map((_, k) => (<Star key={k} className="h-5 w-5 fill-current" />))}
              </div>
              <p className="text-slate-600">“{r.review}”</p>
              <div className="mt-6 font-semibold text-brand-900">{r.patientName}</div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
