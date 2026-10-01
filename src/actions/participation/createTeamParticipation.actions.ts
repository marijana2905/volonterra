'use server';

import { requireVolunteer } from '@/data/auth/requireVolunteer';
import prisma from '@/lib/prisma';
import { NotificationType, ParticipationType } from '@prisma/types';
import { revalidatePath } from 'next/cache';

export const createTeamParticipationAction = async (
  actionId: string,
  teamId: string,
  userId: string,
) => {
  const session = await requireVolunteer();
  if (session.user.id !== userId) {
    return { error: 'Niste ovlašćeni da izvršite ovu akciju.' };
  }

  try {
    // Proveri da li je userId vlasnik teamId
    const team = await prisma.team.findUnique({
      where: { id: teamId, creatorId: userId },
    });
    if (!team) {
      return { error: 'Niste ovlašćeni da prijavite ovaj tim.' };
    }

    // Proveri da li ima mesta na akciji
    const action = await prisma.action.findUnique({
      where: { id: actionId },
      select: {
        id: true,
        slug: true,
        participants: true,
        maxParticipants: true,
        title: true,
      },
    });

    if (!action) {
      return { error: 'Akcija ne postoji.' };
    }

    if (action.participants >= action.maxParticipants) {
      return { error: 'Prijava nije moguća. Maksimalan broj učesnika je dostignut.' };
    }

    // Proveri da li prijavom tima ne bi bio dostignut maxParticipants
    const teamMembers = await prisma.teamMember.findMany({
      where: { teamId },
      select: { userId: true },
    });
    const teamMemberIds = teamMembers.map((member) => member.userId);

    const memberParticipations = await prisma.userActionParticipation.findMany({
      where: {
        actionId,
        userId: { in: teamMemberIds },
      },
      select: {
        userId: true,
        teamId: true,
      },
    });

    const conflictingParticipation = memberParticipations.find(
      (participation) => participation.teamId && participation.teamId !== teamId,
    );

    if (conflictingParticipation) {
      return {
        error: 'Prijava nije moguća. Neki član tima je već prijavljen kao deo drugog tima.',
      };
    }

    const alreadyParticipatingIds = new Set(
      memberParticipations.map((participation) => participation.userId),
    );
    const membersToCreate = teamMemberIds.filter((id) => !alreadyParticipatingIds.has(id));

    const participationsToUpdate = memberParticipations.filter(
      (participation) => participation.teamId !== teamId,
    );

    if (action.participants + membersToCreate.length > action.maxParticipants) {
      return {
        error: 'Prijava nije moguća. Maksimalan broj učesnika bi bio dostignut prijavom tima.',
      };
    }

    await prisma.$transaction(async (tx) => {
      for (const participation of participationsToUpdate) {
        await tx.userActionParticipation.update({
          where: {
            userId_actionId: {
              userId: participation.userId,
              actionId,
            },
          },
          data: {
            type: ParticipationType.TEAM,
            teamId,
            isUserTeamCreator: participation.userId === team.creatorId,
          },
        });

        // Salji notifikaciju clanovima tima kojima se azurira participacija (individual -> team)
        await tx.notification.create({
          data: {
            userId: participation.userId,
            type: NotificationType.BASIC,
            title: `Tim ${team.name} je prijavljen na akciju`,
            message: `Vaša prijava za akciju "${action.title}" je sada timska kao deo tima "${team.name}".`,
            link: `/actions/${action.slug}`,
          },
        });
      }

      if (membersToCreate.length > 0) {
        await tx.userActionParticipation.createMany({
          data: membersToCreate.map((userId) => ({
            userId,
            actionId,
            teamId,
            type: ParticipationType.TEAM,
            isUserTeamCreator: userId === team.creatorId,
          })),
        });

        await tx.action.update({
          where: { id: actionId },
          data: {
            participants: {
              increment: membersToCreate.length,
            },
          },
        });

        // Salji notifikaciju clanovima tima
        await Promise.all(
          membersToCreate.map((userId) =>
            tx.notification.create({
              data: {
                userId,
                type: NotificationType.BASIC,
                title: `Tim ${team.name} je prijavljen na akciju`,
                message: `Prijavljeni ste na akciju "${action.title}" kao član tima "${team.name}".`,
                link: `/actions/${action.slug}`,
              },
            }),
          ),
        );
      }
    });

    revalidatePath(`/actions/${action.slug}`);

    return { error: null };
  } catch (error) {
    console.error('[createTeamParticipation] Error:', error);
    return {
      error:
        'Došlo je do greške prilikom prijavljivanja tima na akciju. Molimo pokušajte ponovo kasnije.',
    };
  }
};
