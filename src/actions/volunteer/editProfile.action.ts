'use server';

import prisma from '@/lib/prisma';

import { requireVolunteer } from '@/data/auth/requireVolunteer';

import {
  volunteerProfileSchema,
  VolunteerProfileSchemaType,
} from '@/schemas/volunteerProfileSchema';
import { revalidatePath } from 'next/cache';

export const editProfileAction = async (data: VolunteerProfileSchemaType) => {
  const session = await requireVolunteer();

  const result = volunteerProfileSchema.safeParse(data);

  if (!result.success) {
    return { error: 'Neispravni podaci' };
  }

  try {
    await prisma.volunteer.update({
      where: { userId: session.user.id },
      data: {
        bio: result.data.bio,
        phone: result.data.phone,
        facebookLink: result.data.facebookLink,
        instagramLink: result.data.instagramLink,
        xLink: result.data.xLink,
      },
    });

    revalidatePath('/dashboard/vol/profile');

    return { error: null };
  } catch (error) {
    console.error('[editProfileAction]', error);
    return { error: 'Došlo je do greške prilikom izmene profila' };
  }
};
