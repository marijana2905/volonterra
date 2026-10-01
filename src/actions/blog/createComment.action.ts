'use server';

import { requireSession } from '@/data/auth/requireSession';
import prisma from '@/lib/prisma';
import { NotificationType } from '@prisma/types';
import { revalidatePath } from 'next/cache';

export const createComment = async (postId: string, content: string, parentId?: string) => {
  const session = await requireSession();

  if (parentId) {
    const parentComment = await prisma.comment.findUnique({
      where: { id: parentId },
    });

    if (!parentComment) {
      return { error: 'Komentar na koji odgovarate ne postoji.' };
    }
  }

  try {
    // Create new comment
    const newComment = await prisma.comment.create({
      data: {
        content,
        authorId: session.user.id,
        postId,
        parentId: parentId || null,
      },
    });

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true, slug: true },
    });

    // Notifikacija autoru posta ako je top level komentar
    if (!parentId && post && post.authorId !== session.user.id) {
      await prisma.notification.create({
        data: {
          userId: post.authorId,
          type: NotificationType.BASIC,
          title: 'Novi komentar',
          message: `${session.user.name} je komentarisao/la vaš post: ${newComment.content}`,
          link: `/blogs/${post.slug}`,
        },
      });
    }

    // Notifikacija autoru komentara na koji se odgovara
    if (parentId && post) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
        select: { authorId: true },
      });

      if (parentComment && parentComment.authorId !== session.user.id) {
        await prisma.notification.create({
          data: {
            userId: parentComment.authorId,
            type: NotificationType.BASIC,
            title: 'Novi odgovor na vaš komentar',
            message: `${session.user.name} je odgovorio/la na vaš komentar: "${newComment.content}"`,
            link: `/blogs/${post.slug}`,
          },
        });
      }
    }

    revalidatePath(`/blogs/${post?.slug}`);

    return { error: null };
  } catch (error) {
    console.error('[createComment]', error);
    return { error: 'Došlo je do greške prilikom kreiranja komentara.' };
  }
};
