'use server';

import { requireOrganizer } from '@/data/auth/requireOrganizer';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { deleteImage } from '../cloudinary/deleteImage';
import { deleteFolder } from '../cloudinary/deleteFolder';

export const deleteAction = async (id: string) => {
  await requireOrganizer();

  const action = await prisma.action.findUnique({
    where: { id },
  });

  if (!action) {
    return { error: 'Akcija nije pronađena.' };
  }

  if (action.participants > 0) {
    return { error: 'Ne možete obrisati akciju koja ima učesnike.' };
  }

  try {
    const bannerImage = action.bannerImage;

    await prisma.action.delete({
      where: { id },
    });

    // Delete se pokrece u pozadini kako korisnik ne bi cekao na brisanje slike
    if (bannerImage) {
      deleteFolder(`actions/${id}`);
    }

    revalidatePath('/dashboard/org/actions');

    return { error: null };
  } catch (error) {
    console.error('[deleteAction] Error deleting action:', error);
    return { error: 'Došlo je do greške prilikom brisanja akcije.' };
  }
};
