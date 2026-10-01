'use server';

import { requireVolunteer } from '@/data/auth/requireVolunteer';
import { TeamInviteNotificationMetadata } from '@/types/notification.type';
import prisma from '@/lib/prisma';
import { InvitationStatus, NotificationStatus } from '@prisma/types';
import { revalidatePath } from 'next/cache';

export const respondToInvitationAction = async (
  invitationId: string,
  isAccepted: boolean,
  notificationId: string,
) => {
  const session = await requireVolunteer();

  // Pribavi invitation
  const invitation = await prisma.teamInvitation.findFirst({
    where: { id: invitationId },
  });

  if (!invitation) {
    return { error: 'Pozivnica nije pronađena' };
  }

  // Pribavi notifikaciju
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    return { error: 'Notifikacija nije pronađena' };
  }

  // Ako se prihvata
  if (isAccepted) {
    // 1. Dodaj korisnika u tim
    await prisma.teamMember.create({
      data: {
        userId: session.user.id,
        teamId: invitation.teamId,
      },
    });

    // 2. Ažuriraj status pozivnice
    await prisma.teamInvitation.update({
      where: { id: invitationId },
      data: { status: InvitationStatus.ACCEPTED },
    });
  } else {
    // Ako je odbijena

    // Ažuriraj status pozivnice
    await prisma.teamInvitation.update({
      where: { id: invitationId },
      data: { status: InvitationStatus.REJECTED },
    });
  }

  // Ažuriraj status notifikacije (stavi na read i oznaci u metadata polja isAccepted i isResponded)
  const existingMetadata = (notification.metadata ?? {}) as TeamInviteNotificationMetadata;

  // Ako nije mark as read onda izmeni i ta polja, inace samo isResponded i isAccepted
  if (notification.status !== NotificationStatus.READ) {
    await prisma.notification.update({
      where: { id: notificationId },
      data: {
        status: NotificationStatus.READ,
        readAt: new Date(),
        metadata: {
          ...existingMetadata,
          isResponded: true,
          isAccepted: isAccepted,
        },
      },
    });
  } else {
    await prisma.notification.update({
      where: { id: notificationId },
      data: {
        metadata: {
          ...existingMetadata,
          isResponded: true,
          isAccepted: isAccepted,
        },
      },
    });
  }

  revalidatePath('/dashboard/vol/teams');

  return { error: null };
};
