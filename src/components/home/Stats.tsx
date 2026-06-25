'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';

type Stat = { label: string; value: string };

function Counter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!inView) return;
    const num = parseInt(value.replace(/\D/g, ''), 10) || 0;
    const suffix = value.replace(/[0-9]/g, '');
    let current = 0;
    const step = Math.max(1, Math.ceil(num / 60));
    const timer = setInterval(() => {
      current += step;
      if (current >= num) { current = num; clearInterval(timer); }
      setDisplay(current + suffix);
    }, 25);
    return () => clearInterval(timer);
  }, [inView, value]);

  return <span ref={ref}>{display}</span>;
}

export function Stats({ stats }: { stats: Stat[] }) {
  if (!stats?.length) return null;
  return (
    <section className="bg-brand-900 py-16">
      <Container className="grid grid-cols-2 gap-8 md:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
            <div className="text-4xl font-extrabold text-brand-400 sm:text-5xl"><Counter value={s.value} /></div>
            <div className="mt-2 text-sm text-white/70">{s.label}</div>
          </motion.div>
        ))}
      </Container>
    </section>
  );
}
