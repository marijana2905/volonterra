'use server';

import { requireSession } from '@/data/auth/requireSession';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const deleteComment = async (commentId: string) => {
  const session = await requireSession();

  try {
    const deletedComment = await prisma.comment.delete({
      where: {
        id: commentId,
        authorId: session.user.id,
      },
      include: {
        post: true,
      },
    });

    revalidatePath(`/blogs/${deletedComment.post.slug}`);

    return { error: null };
  } catch (error) {
    console.error('[deleteComment] Greska pri brisanju komentara:', error);
    return { error: 'Doslo je do greske pri brisanju komentara.' };
  }
};
