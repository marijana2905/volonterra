'use server';

import { requireSession } from '@/data/auth/requireSession';
import prisma from '@/lib/prisma';
import { NotificationStatus } from '@prisma/types';

export const markAsReadNotification = async (id: string) => {
  await requireSession();

  try {
    await prisma.notification.update({
      where: { id },
      data: {
        status: NotificationStatus.READ,
        readAt: new Date(),
      },
    });

    return { error: null };
  } catch (error) {
    console.error('[markAsReadNotification]', error);
    return { error: 'Greška prilikom označavanja obaveštenja kao pročitano' };
  }
};
