import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  serviceId: z.string().optional(),
  doctorId: z.string().optional(),
  date: z.string().min(1),
  time: z.string().min(1),
  message: z.string().optional()
});

// Public endpoint: a patient submits an appointment request (status Pending).
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  const d = parsed.data;
  await prisma.booking.create({
    data: {
      name: d.name, phone: d.phone, email: d.email,
      date: new Date(d.date), time: d.time, message: d.message,
      serviceId: d.serviceId || null, doctorId: d.doctorId || null
    }
  });
  return NextResponse.json({ ok: true });
}
