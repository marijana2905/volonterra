'use server';

import { requireVolunteer } from '@/data/auth/requireVolunteer';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const createIndividualParticipation = async (actionId: string, userId: string) => {
  const session = await requireVolunteer();
  if (session.user.id !== userId) {
    return { error: 'Niste ovlašćeni da izvršite ovu akciju.' };
  }

  try {
    // Proveri da li ima mesta na akciji
    const action = await prisma.action.findUnique({
      where: { id: actionId },
      select: {
        id: true,
        slug: true,
        participants: true,
        maxParticipants: true,
      },
    });

    if (!action) {
      return { error: 'Akcija ne postoji.' };
    }

    if (action.participants >= action.maxParticipants) {
      return { error: 'Prijava nije moguća. Maksimalan broj učesnika je dostignut.' };
    }

    // Proveri da li je korisnik već prijavljen na ovu akciju
    const existingParticipation = await prisma.userActionParticipation.findUnique({
      where: {
        userId_actionId: {
          userId,
          actionId,
        },
      },
    });

    if (existingParticipation) {
      return { error: 'Već ste prijavljeni na ovu akciju.' };
    }

    // Kreiraj novu prijavu
    const newParticipation = await prisma.userActionParticipation.create({
      data: {
        action: {
          connect: { id: actionId },
        },
        user: {
          connect: { id: userId },
        },
        type: 'INDIVIDUAL',
        status: 'APPLIED',
      },
    });

    if (!newParticipation) {
      return { error: 'Prijava na akciju nije uspela. Molimo pokušajte ponovo.' };
    }

    // Ako je uspesna prijava, povecati broj prijava na akciji
    await prisma.action.update({
      where: { id: actionId },
      data: {
        participants: {
          increment: 1,
        },
      },
    });

    revalidatePath(`/actions/${action.slug}`);

    return { error: null };
  } catch (error) {
    console.error('[createIndividualParticipation] Error:', error);
    return {
      error: 'Došlo je do greške prilikom prijave na akciju. Molimo pokušajte ponovo kasnije.',
    };
  }
};
