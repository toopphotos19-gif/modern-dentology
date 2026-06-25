import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  address: z.string().optional(),
  qualification: z.string().optional(),
  experience: z.string().optional(),
  resumeUrl: z.string().optional(),
  jobId: z.string().optional()
});

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  const d = parsed.data;
  await prisma.application.create({
    data: {
      name: d.name, phone: d.phone, email: d.email,
      address: d.address, qualification: d.qualification, experience: d.experience,
      resumeUrl: d.resumeUrl || null, jobId: d.jobId || null
    }
  });
  return NextResponse.json({ ok: true });
}
