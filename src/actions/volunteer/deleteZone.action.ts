'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { requireVolunteer } from '@/data/auth/requireVolunteer';

export const deleteZoneAction = async (zoneId: string) => {
  const session = await requireVolunteer();

  try {
    await prisma.interestZone.delete({
      where: { id: zoneId, userId: session.user.id },
    });

    revalidatePath('/dashboard/vol/zones');

    return { error: null };
  } catch (error) {
    console.log('[DeleteZoneAction] Error:', error);
    return { error: 'Došlo je do greške. Pokušajte ponovo.' };
  }
};
