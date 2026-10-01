'use server';

import { requireOrganizer } from '@/data/auth/requireOrganizer';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const continueQuestionAction = async (questionId: string) => {
  const session = await requireOrganizer();

  if (!session.user || session.user.role !== 'ORGANIZER') {
    return { error: 'Niste autorizovani da otvorite ovaj razgovor.' };
  }

  try {
    await prisma.question.update({
      where: { id: questionId, organizerUserId: session.user.id },
      data: { closed: false },
    });

    revalidatePath('/dashboard/org/questions');

    return { error: null };
  } catch (error) {
    console.error('[continueQuestionAction]', error);
    return { error: 'Došlo je do greške prilikom ponovnog otvaranja razgovora.' };
  }
};
