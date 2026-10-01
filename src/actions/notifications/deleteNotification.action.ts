'use server';

import { requireSession } from '@/data/auth/requireSession';
import prisma from '@/lib/prisma';

export const deleteNotificationAction = async (notificationId: string) => {
  const session = await requireSession();

  try {
    await prisma.notification.delete({
      where: { id: notificationId, userId: session.user.id },
    });

    return { error: null };
  } catch (error) {
    console.error('[deleteNotificationAction]', error);
    return { error: 'Greška prilikom brisanja obaveštenja' };
  }
};
