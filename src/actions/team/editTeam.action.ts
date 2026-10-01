'use server';

import { requireVolunteer } from '@/data/auth/requireVolunteer';
import { TeamFormSchemaType } from '@/schemas/teamSchema';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const editTeamAction = async (values: TeamFormSchemaType, teamId: string) => {
  const session = await requireVolunteer();

  const { name, bio } = values;

  const trimmedName = name.trim();
  if (trimmedName.length < 2) {
    return { error: 'Ime tima mora imati najmanje 2 karaktera' };
  }

  try {
    // Proveri da li je korisnik vlasnik tima
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: { creatorId: true },
    });

    if (!team || team.creatorId !== session.user.id) {
      return { error: 'Samo kreator tima može da izmeni informacije o timu' };
    }

    await prisma.team.update({
      where: { id: teamId },
      data: {
        name: trimmedName,
        bio,
      },
    });

    revalidatePath('/dashboard/vol/teams');

    return { error: null };
  } catch (error) {
    console.error('[editTeamAction]', error);
    return { error: 'Greška prilikom izmene tima' };
  }
};
