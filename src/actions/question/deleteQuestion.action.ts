'use server';

import { requireOrganizer } from '@/data/auth/requireOrganizer';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const deleteQuestionAction = async (questionId: string) => {
  const session = await requireOrganizer();

  if (!session.user || session.user.role !== 'ORGANIZER') {
    return { error: 'Niste autorizovani da obrišete ovo pitanje.' };
  }

  try {
    await prisma.question.delete({
      where: { id: questionId, organizerUserId: session.user.id },
    });

    revalidatePath('/dashboard/org/questions');

    return { error: null };
  } catch (error) {
    console.error('[deleteQuestionAction]', error);
    return { error: 'Došlo je do greške prilikom brisanja pitanja.' };
  }
};
