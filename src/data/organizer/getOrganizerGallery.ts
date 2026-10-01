import prisma from '@/lib/prisma';

export const getOrganizerGallery = async (id: string) => {
  const images = await prisma.organizer.findUnique({
    where: { userId: id },
    select: {
      galleryImages: true,
    },
  });

  if (!images) {
    return [];
  }

  return images.galleryImages;
};
