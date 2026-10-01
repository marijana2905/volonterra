'use server';

import { requireOrganizer } from '@/data/auth/requireOrganizer';
import { CancelActionSchemaType } from '@/schemas/cancelActionSchema';
import prisma from '@/lib/prisma';
import { ActionStatus, NotificationType, ParticipationStatus } from '@prisma/types';

import { sendCancelActionNotificationEmail } from '@/lib/nodemailer/mailerService';
import { revalidatePath } from 'next/cache';

export const cancelAction = async (values: CancelActionSchemaType, actionId: string) => {
  const session = await requireOrganizer();

  const reason = values.reason.trim();

  if (!reason) {
    return { error: 'Razlog otkazivanja je obavezan.' };
  }

  const action = await prisma.action.findFirst({
    where: {
      id: actionId,
      organizer: {
        userId: session.user.id,
      },
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!action) {
    return { error: 'Akcija nije pronađena ili nemate dozvolu da je otkažete.' };
  }

  if (action.status === ActionStatus.CANCELLED) {
    return { error: 'Akcija je već otkazana.' };
  }

  try {
    const cancelledAction = await prisma.$transaction(
      async (tx) => {
        const participants = await tx.userActionParticipation.findMany({
          where: {
            actionId,
            status: ParticipationStatus.APPLIED,
          },
          select: {
            userId: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        });

        const updatedAction = await tx.action.update({
          where: { id: actionId },
          data: {
            status: ActionStatus.CANCELLED,
            cancellationReason: reason,
            participants: 0,
          },
          select: {
            id: true,
            title: true,
            slug: true,
          },
        });

        if (participants.length) {
          await tx.userActionParticipation.updateMany({
            where: {
              actionId,
              status: ParticipationStatus.APPLIED,
            },
            data: {
              status: ParticipationStatus.CANCELLED,
            },
          });

          await tx.notification.createMany({
            data: participants.map((participant) => ({
              userId: participant.userId,
              type: NotificationType.BASIC,
              title: 'Akcija otkazana',
              message: `Akcija "${updatedAction.title}" je otkazana. Razlog: ${reason}`,
              link: updatedAction.slug ? `/actions/${updatedAction.slug}` : undefined,
            })),
          });

          for (const participant of participants) {
            const { success } = await sendCancelActionNotificationEmail(
              participant.user.email,
              updatedAction.title,
              reason,
            );

            if (!success) {
              throw new Error('EMAIL_SEND_FAILED');
            }
          }
        }

        return updatedAction;
      },
      { timeout: 20000 },
    );

    revalidatePath('/dashboard/org/actions');

    return { error: null };
  } catch (error) {
    if (error instanceof Error && error.message === 'EMAIL_SEND_FAILED') {
      return {
        error: 'Došlo je do greške prilikom slanja email obaveštenja. Akcija nije otkazana.',
      };
    }

    console.error('[cancelAction]', error);
    return { error: 'Došlo je do greške prilikom otkazivanja akcije. Pokušajte ponovo.' };
  }
};
