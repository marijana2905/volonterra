'use server';

import { requireVolunteer } from '@/data/auth/requireVolunteer';
import { ImpressionFormSchemaType } from '@/schemas/impressionSchema';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const editImpression = async (values: ImpressionFormSchemaType, impressionId: string) => {
  const session = await requireVolunteer();

  // Proveri da li utisak pripada korisniku
  const existingImpression = await prisma.actionImpression.findUnique({
    where: {
      id: impressionId,
    },
  });

  if (!existingImpression || existingImpression.userId !== session.user.id) {
    return { error: 'Ne možete izmeniti ovaj utisak.' };
  }

  // Izmeni utisak
  try {
    const updatedImpression = await prisma.actionImpression.update({
      where: {
        id: impressionId,
      },
      data: values,
    });

    const action = await prisma.action.findUnique({
      where: { id: updatedImpression.actionId },
      select: {
        slug: true,
      },
    });

    // Revalidiraj stranicu akcije da bi se prikazale izmene
    revalidatePath(`/actions/${action?.slug}`);

    return { error: null };
  } catch (error) {
    console.error('[editImpression]', error);
    return { error: 'Došlo je do greške prilikom izmene utiska. Molimo pokušajte ponovo.' };
  }
};
