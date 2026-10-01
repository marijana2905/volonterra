'use server';

import { requireVolunteer } from '@/data/auth/requireVolunteer';
import { ZoneFormSchemaType, zoneSchema } from '@/schemas/zoneSchema';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const addZoneAction = async (values: ZoneFormSchemaType) => {
  const session = await requireVolunteer();

  const result = zoneSchema.safeParse(values);

  if (!result.success) {
    console.log('[AddZoneAction] Invalid data:', result.error);
    return { error: 'Nevalidni podaci. Pokušajte ponovo.' };
  }

  const { name, center, radius } = result.data;

  if (center.latitude === undefined || center.longitude === undefined) {
    console.log('[AddZoneAction] Missing coordinates');
    return { error: 'Koordinate nisu validne. Pokušajte ponovo.' };
  }

  try {
    await prisma.interestZone.create({
      data: {
        name,
        latitude: center.latitude,
        longitude: center.longitude,
        radius,
        userId: session.user.id,
      },
    });

    revalidatePath('/dashboard/vol/zones');

    return { error: null };
  } catch (error) {
    console.log('[AddZoneAction] Error:', error);
    return { error: 'Došlo je do greške. Pokušajte ponovo.' };
  }
};
