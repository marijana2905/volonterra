'use server';

import { requireOrganizer } from '@/data/auth/requireOrganizer';
import prisma from '@/lib/prisma';
import { ParticipationStatus } from '@prisma/types';
import { revalidatePath } from 'next/cache';

export const organizerCancelIndividualParticipation = async (actionId: string, userId: string) => {
  await requireOrganizer();

  try {
    // 1. Proveri da li je prijava vec otkazana
    const participation = await prisma.userActionParticipation.findFirst({
      where: {
        actionId,
        userId,
      },
      select: {
        status: true,
        action: {
          select: {
            slug: true,
          },
        },
      },
    });

    if (!participation) {
      return { error: 'Nema prijave za ovu akciju.' };
    }

    if (participation.status === ParticipationStatus.CANCELLED) {
      return { error: 'Prijava je već otkazana.' };
    }

    // 2. Otkazi prijavu (postavi status na otkazano)
    await prisma.userActionParticipation.update({
      where: {
        userId_actionId: {
          userId,
          actionId,
        },
      },
      data: {
        status: ParticipationStatus.CANCELLED,
      },
    });

    // 3. Smanji broj učesnika na akciji
    await prisma.action.update({
      where: { id: actionId },
      data: {
        participants: {
          decrement: 1,
        },
      },
    });

    // TODO: 4. Obavestenje volonteru da je akcija otkazana

    revalidatePath(`/dashboard/org/actions/${participation.action.slug}/participations`);

    return { error: null };
  } catch (error) {
    console.error('[organizerCancelIndividualParticipation] Error:', error);
    return {
      error: 'Došlo je do greške prilikom otkazivanja prijave. Molimo pokušajte ponovo kasnije.',
    };
  }
};
