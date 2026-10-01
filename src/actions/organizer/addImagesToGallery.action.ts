'use server';

import { revalidatePath } from 'next/cache';
import { requireOrganizer } from '@/data/auth/requireOrganizer';
import prisma from '@/lib/prisma';

export const addImagesToGallery = async (imageUrls: string[]) => {
  const session = await requireOrganizer();

  try {
    await prisma.organizer.update({
      where: { userId: session.user.id },
      data: {
        galleryImages: { push: imageUrls },
      },
    });

    revalidatePath('/dashboard/org/gallery');

    return { error: null };
  } catch (error) {
    console.error('[addImagesToGallery]:', error);
    return { error: 'Greška prilikom dodavanja slika u galeriju. Pokušajte ponovo.' };
  }
};
