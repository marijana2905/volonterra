'use server';

import prisma from '@/lib/prisma';
import { requireSession } from '@/data/auth/requireSession';

export async function deleteBlog(id: string) {
  const session = await requireSession();

  try {
    const blog = await prisma.post.findUnique({ where: { id } });

    if (!blog) {
      return { error: 'Blog nije pronađen.' };
    }

    if (blog.authorId !== session.user.id && session.user.role !== 'ADMIN') {
      return { error: 'Niste autorizovani za ovu akciju.' };
    }

    await prisma.post.delete({ where: { id } });

    return { error: null };
  } catch (error) {
    console.error('[deleteBlog] Error:', error);
    return { error: 'Došlo je do greške prilikom brisanja bloga.' };
  }
}
