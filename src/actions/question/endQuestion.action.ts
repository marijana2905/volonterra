'use server';

import { requireOrganizer } from '@/data/auth/requireOrganizer';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const endQuestionAction = async (questionId: string) => {
  const session = await requireOrganizer();

  if (!session.user || session.user.role !== 'ORGANIZER') {
    return { error: 'Niste autorizovani da završite ovaj razgovor.' };
  }

  try {
    await prisma.question.update({
      where: { id: questionId, organizerUserId: session.user.id },
      data: { closed: true },
    });

    revalidatePath('/dashboard/org/questions');

    return { error: null };
  } catch (error) {
    console.error('[endQuestionAction]', error);
    return { error: 'Došlo je do greške prilikom zatvaranja razgovora.' };
  }
};
