'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import type { BookingStatus } from '@prisma/client';

export async function setBookingStatus(id: string, formData: FormData) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');
  const status = formData.get('status') as string;
  await prisma.booking.update({ where: { id }, data: { status: status as BookingStatus } });
  revalidatePath('/admin/bookings');
}
