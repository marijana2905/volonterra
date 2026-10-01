'use server';

import { requireVolunteer } from '@/data/auth/requireVolunteer';
import prisma from '@/lib/prisma';
import { ParticipationStatus, ParticipationType } from '@prisma/types';
import { revalidatePath } from 'next/cache';

export const cancelIParticipation = async (actionId: string, userId: string) => {
  const session = await requireVolunteer();
  if (session.user.id !== userId) {
    return { error: 'Niste ovlašćeni da izvršite ovu akciju.' };
  }

  try {
    // 1. Proveri da li korisnik ima prijavu na akciju
    const participation = await prisma.userActionParticipation.findFirst({
      where: {
        actionId,
        userId,
      },
      select: {
        status: true,
        createdAt: true,
        type: true,
        teamId: true,
        isUserTeamCreator: true,
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

    // 2. Proveri da li je proslo 24h od prijave (otkazivanje je moguce samo ako je proslo manje od 24h)
    const now = new Date();
    const participationDate = new Date(participation.createdAt);
    const timeDifference = now.getTime() - participationDate.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60);
    if (hoursDifference > 24) {
      return { error: 'Otkazivanje prijave je moguće samo 24 sata od prijave.' };
    }

    // 3. Otkazi prijavu (postavi status na otkazano)
    if (
      participation.type === ParticipationType.TEAM &&
      participation.teamId &&
      participation.isUserTeamCreator
    ) {
      await prisma.$transaction(async (tx) => {
        const { count } = await tx.userActionParticipation.updateMany({
          where: {
            actionId,
            teamId: participation.teamId,
            status: {
              not: ParticipationStatus.CANCELLED,
            },
          },
          data: {
            status: ParticipationStatus.CANCELLED,
          },
        });

        if (count > 0) {
          await tx.action.update({
            where: { id: actionId },
            data: {
              participants: {
                decrement: count,
              },
            },
          });
        }
      });
    } else {
      await prisma.$transaction(async (tx) => {
        await tx.userActionParticipation.update({
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

        await tx.action.update({
          where: { id: actionId },
          data: {
            participants: {
              decrement: 1,
            },
          },
        });
      });
    }

    // Osvesi podatke u tabeli volonteru
    revalidatePath('/dashboard/vol/actions');

    return { error: null };
  } catch (error) {
    console.error('[cancelIndividualParticipation] Error:', error);
    return {
      error: 'Došlo je do greške prilikom otkazivanja prijave. Molimo pokušajte ponovo kasnije.',
    };
  }
};
