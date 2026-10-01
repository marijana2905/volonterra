'use server';

import prisma from '@/lib/prisma';
import { requireSession } from '@/data/auth/requireSession';
import { revalidatePath } from 'next/cache';

export async function toggleBannedPost(postId: string, isBanned: boolean) {
  const session = await requireSession();

  // samo admin
  if (session.user.role !== 'ADMIN') {
    return { error: 'Nemate dozvolu za ovu akciju.' };
  }

  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      return { error: 'Blog nije pronađen.' };
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { isBanned },
    });

    // Revalidacija stranice
    revalidatePath(`/blogs`);

    return { error: null, post: updatedPost };
  } catch (error) {
    console.error('[toggleBannedPost] Error:', error);
    return { error: 'Došlo je do greške prilikom označavanja bloga.' };
  }
}
