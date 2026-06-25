'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import type { ApplicationStatus } from '@prisma/client';

export async function setApplicationStatus(id: string, status: string) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');
  await prisma.application.update({ where: { id }, data: { status: status as ApplicationStatus } });
  revalidatePath('/admin/careers');
}
