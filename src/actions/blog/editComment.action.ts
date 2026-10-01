'use server';

import { requireSession } from '@/data/auth/requireSession';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const editComment = async (commentId: string, content: string) => {
  const session = await requireSession();

  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
      authorId: session.user.id,
    },
    include: {
      post: true,
    },
  });

  if (!comment) {
    return { error: 'Komentar nije pronađen ili nemate dozvolu za izmenu.' };
  }

  try {
    await prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });

    revalidatePath(`/blogs/${comment.post.slug}`);

    return { error: null };
  } catch (error) {
    console.error('[editComment]', error);
    return { error: 'Došlo je do greške prilikom izmene komentara.' };
  }
};
