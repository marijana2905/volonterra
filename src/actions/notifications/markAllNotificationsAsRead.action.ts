'use server';

import { requireSession } from '@/data/auth/requireSession';
import prisma from '@/lib/prisma';
import { NotificationStatus } from '@prisma/types';

export const markAllAsReadNotifications = async () => {
  const session = await requireSession();

  try {
    // Oznaci sva obavestenja trenutnog korisnika kao procitana
    await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        status: NotificationStatus.UNREAD,
      },
      data: {
        status: NotificationStatus.READ,
        readAt: new Date(),
      },
    });

    return { error: null };
  } catch (error) {
    console.error('[markAllAsReadNotifications]', error);
    return { error: 'Greška prilikom označavanja svih obaveštenja kao pročitano' };
  }
};
