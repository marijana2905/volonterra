'use server';

import { revalidatePath } from 'next/cache';
import { requireOrganizer } from '@/data/auth/requireOrganizer';
import prisma from '@/lib/prisma';

import { deleteImage } from '@/actions/cloudinary/deleteImage';

export const deleteImageFromGallery = async (url: string) => {
  const session = await requireOrganizer();

  try {
    const organizer = await prisma.organizer.findUnique({
      where: { userId: session.user.id },
      select: { galleryImages: true },
    });

    if (!organizer) {
      return { error: 'Organizator nije pronađen.' };
    }

    if (!organizer.galleryImages.includes(url)) {
      return { error: 'Fotografija nije pronađena u galeriji.' };
    }

    await deleteImage(url);

    const updatedImages = organizer.galleryImages.filter((imageUrl) => imageUrl !== url);

    await prisma.organizer.update({
      where: { userId: session.user.id },
      data: {
        galleryImages: {
          set: updatedImages,
        },
      },
    });

    revalidatePath('/dashboard/org/gallery');

    return { error: null };
  } catch (error) {
    console.error('[deleteImageFromGallery]', error);
    return { error: 'Neuspešno brisanje fotografije iz galerije.' };
  }
};
