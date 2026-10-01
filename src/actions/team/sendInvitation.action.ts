'use server';

import { requireVolunteer } from '@/data/auth/requireVolunteer';
import { TeamInviteNotificationMetadata } from '@/types/notification.type';
import prisma from '@/lib/prisma';
import { NotificationType } from '@prisma/types';

export const sendInvitationAction = async (teamId: string, selectedUserIds: string[]) => {
  const session = await requireVolunteer();

  const team = await prisma.team.findFirst({
    where: { id: teamId },
  });

  if (!team) {
    return { error: 'Tim ne postoji.' };
  }

  if (team.creatorId !== session.user.id) {
    return { error: 'Niste ovlašćeni za slanje pozivnica.' };
  }

  // Posalji pozivnice (kreiraj team invitation) i notifikacije
  try {
    // Ukloni duplikate iz prosleđenih korisničkih ID-jeva
    const uniqueUserIds = Array.from(new Set(selectedUserIds)).filter(Boolean);

    const inviterName = session.user.displayUsername || session.user.name || 'Korisnik';

    const results = await Promise.all(
      uniqueUserIds.map(async (userId) => {
        try {
          // Transakcija: kreiraj pozivnicu i odgovarajuću notifikaciju
          const res = await prisma.$transaction(async (tx) => {
            const invitation = await tx.teamInvitation.create({
              data: {
                teamId: teamId,
                invitedUserId: userId,
                invitedById: session.user.id,
              },
            });

            await tx.notification.create({
              data: {
                userId: userId,
                type: NotificationType.TEAM_INVITE,
                title: `Poziv u tim ${team.name}`,
                message: `${inviterName} vas je pozvao/la da se pridružite timu "${team.name}"`,
                link: '/dashboard/vol/notifications',
                metadata: {
                  teamId: team.id,
                  teamName: team.name,
                  invitedById: session.user.id,
                  invitationId: invitation.id,
                  isResponded: false,
                  isAccepted: false, // false initial state, when responded change to true or stay at false
                } as TeamInviteNotificationMetadata,
              },
            });

            return { ok: true as const, userId };
          });

          return res;
        } catch (err: any) {
          // Ako postoji unique constraint (vec postoji pozivnica), preskoči tog korisnika
          const code = err?.code ?? err?.meta?.cause;
          const reason = code === 'P2002' ? 'ALREADY_INVITED' : 'ERROR';
          return { ok: false as const, userId, reason };
        }
      }),
    );

    const failed = results.filter((r) => !r.ok);
    return {
      success: true,
      invitedCount: results.length - failed.length,
      failed: failed.map((f) => ({ userId: f.userId, reason: (f as any).reason })),
    };
  } catch (error) {
    return { error: 'Došlo je do greške pri slanju pozivnica.' };
  }
};
