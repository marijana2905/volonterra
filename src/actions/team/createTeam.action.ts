'use server';

import { requireVolunteer } from '@/data/auth/requireVolunteer';
import { TeamFormSchemaType } from '@/schemas/teamSchema';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const createTeamAction = async (values: TeamFormSchemaType) => {
  const session = await requireVolunteer();

  const { name, bio } = values;

  const trimmedName = name.trim();
  if (trimmedName.length < 2) {
    return { error: 'Ime tima mora imati najmanje 2 karaktera' };
  }

  try {
    await prisma.team.create({
      data: {
        name: trimmedName,
        bio,
        creator: {
          connect: {
            id: session.user.id,
          },
        },
        members: {
          create: {
            user: { connect: { id: session.user.id } }, // creator je automatski i član
          },
        },
      },
    });

    revalidatePath('/dashboard/vol/teams');

    return { error: null };
  } catch (error) {
    console.error('[createTeamAction]', error);
    return { error: 'Greška prilikom kreiranja tima' };
  }
};
