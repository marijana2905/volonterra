import prisma from '@/lib/prisma';
import { getUserSession } from '../auth/getUserSession';

export const isOrganizerLikedByUser = async (username: string) => {
  const session = await getUserSession();

  if (!session) {
    return false;
  }

  const organizer = await prisma.organizer.findUnique({
    where: { username },
    select: { userId: true },
  });

  if (!organizer) {
    return false;
  }

  const like = await prisma.organizerLike.findUnique({
    where: {
      userId_organizerUserId: {
        userId: session.user.id,
        organizerUserId: organizer.userId,
      },
    },
  });

  return like !== null;
};
