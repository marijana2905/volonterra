'use server';

import { requireOrganizer } from '@/data/auth/requireOrganizer';
import prisma from '@/lib/prisma';
import { ParticipationStatus } from '@prisma/types';
import { revalidatePath } from 'next/cache';

export const applyAgain = async (actionId: string, userId: string) => {
  await requireOrganizer();

  try {
    // 1. Nastavi dalje samo ako je prijava na CANCELLED
    const participation = await prisma.userActionParticipation.findFirst({
      where: {
        actionId,
        userId,
      },
      select: {
        status: true,
        action: {
          select: {
            slug: true,
          },
        },
      },
    });

    if (!participation) {
      return { error: 'Nema prijave za ovu akciju.' };
    }

    if (participation.status !== ParticipationStatus.CANCELLED) {
      return { error: 'Volonter je već prijavljen.' };
    }

    // 2. Ponovo prijavi volontera (postavi status na APPLIED)
    await prisma.userActionParticipation.update({
      where: {
        userId_actionId: {
          userId,
          actionId,
        },
      },
      data: {
        status: ParticipationStatus.APPLIED,
      },
    });

    // 3. Povecaj broj prijava za akciju
    await prisma.action.update({
      where: { id: actionId },
      data: {
        participants: {
          increment: 1,
        },
      },
    });

    // TODO: 4. Obavesti volontera da je uspesno vracen na akciju

    revalidatePath(`/dashboard/org/actions/${participation.action.slug}/participations`);

    return { error: null };
  } catch (error) {
    console.error('[applyAgain] Error:', error);
    return { error: 'Greška prilikom ponovnog prijavljivanja.' };
  }
};
