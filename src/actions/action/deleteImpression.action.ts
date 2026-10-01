'use server';

import { requireVolunteer } from '@/data/auth/requireVolunteer';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const deleteImpression = async (impressionId: string) => {
  const session = await requireVolunteer();

  // Proveri da li je korisnik vlasnik utiska
  const impression = await prisma.actionImpression.findUnique({
    where: { id: impressionId },
  });

  if (!impression || impression.userId !== session.user.id) {
    return { error: 'Nemate dozvolu da obrišete ovaj utisak.' };
  }

  // Obriši utisak
  try {
    await prisma.actionImpression.delete({
      where: { id: impressionId },
    });

    const action = await prisma.action.findUnique({
      where: { id: impression.actionId },
      select: {
        slug: true,
      },
    });

    // Revalidiraj stranicu akcije da bi se prikazale izmene
    revalidatePath(`/actions/${action?.slug}`);

    return { error: null };
  } catch (error) {
    console.error('[deleteImpression] Error deleting impression:', error);
    return { error: 'Došlo je do greške prilikom brisanja utiska. Molimo pokušajte ponovo.' };
  }
};
