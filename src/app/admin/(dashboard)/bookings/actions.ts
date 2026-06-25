'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import type { BookingStatus } from '@prisma/client';

export async function setBookingStatus(id: string, status: string) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');
  await prisma.booking.update({ where: { id }, data: { status: status as BookingStatus } });
  revalidatePath('/admin/bookings');
}
