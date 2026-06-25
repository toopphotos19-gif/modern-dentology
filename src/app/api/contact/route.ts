import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1)
});

// Stores a contact inquiry as a Lead so it appears in the admin dashboard.
export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  const d = parsed.data;
  await prisma.lead.create({
    data: { name: d.name, email: d.email, phone: d.phone, message: d.message, source: 'Contact Form' }
  });
  return NextResponse.json({ ok: true });
}
