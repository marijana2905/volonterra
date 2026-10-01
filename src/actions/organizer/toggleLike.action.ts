'use server';

import { requireSession } from '@/data/auth/requireSession';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const toggleLikeForOrganizer = async (username: string) => {
  const session = await requireSession();

  try {
    await prisma.$transaction(async (tx) => {
      const organizer = await tx.organizer.findUnique({
        where: { username },
        select: { userId: true },
      });

      if (!organizer) {
        throw new Error('Organizator nije pronađen');
      }

      const existingLike = await tx.organizerLike.findUnique({
        where: {
          userId_organizerUserId: {
            userId: session.user.id,
            organizerUserId: organizer.userId,
          },
        },
      });

      if (existingLike) {
        // Unlike: delete like and decrement count atomically
        await tx.organizerLike.delete({
          where: {
            userId_organizerUserId: {
              userId: session.user.id,
              organizerUserId: organizer.userId,
            },
          },
        });
        await tx.organizer.update({
          where: { userId: organizer.userId },
          data: { likesCount: { decrement: 1 } },
        });
      } else {
        // Like: create like and increment count atomically
        await tx.organizerLike.create({
          data: {
            userId: session.user.id,
            organizerUserId: organizer.userId,
          },
        });
        await tx.organizer.update({
          where: { userId: organizer.userId },
          data: { likesCount: { increment: 1 } },
        });
      }
    });

    revalidatePath(`/organizations/${username}`);

    return { error: null };
  } catch (e: Error | unknown) {
    return { error: (e as Error)?.message ?? 'Greška pri ažuriranju lajka' };
  }
};
