'use server';

import prisma from '@/lib/prisma';
import { requireSession } from '@/data/auth/requireSession';
import cloudinary from '@/lib/cloudinary';

export const uploadAvatar = async (
  base64Image: string,
  fileName: string,
  teamId: string | null = null,
) => {
  const session = await requireSession();

  const AVATAR_UPLOAD_PRESET = process.env.CLOUDINARY_AVATAR_UPLOAD_PRESET;

  try {
    const newFileName = teamId === null ? fileName : `team_${fileName}`;

    // Preset is defined in cloudinary settings and quality is auto so it will handle the optimization during upload
    const result = await cloudinary.uploader.upload(base64Image, {
      upload_preset: AVATAR_UPLOAD_PRESET,
      public_id: newFileName,
    });

    const secureUrl = result.secure_url;

    if (teamId) {
      // Update team table
      await prisma.team.update({
        where: { id: teamId },
        data: { image: secureUrl },
      });

      return { error: null };
    } else {
      // Update user table
      await prisma.user.update({
        where: { id: session.user.id },
        data: { image: secureUrl },
      });

      // Update organizer/volunteer table
      if (session.user.role === 'ORGANIZER') {
        await prisma.organizer.update({
          where: { userId: session.user.id },
          data: { image: secureUrl },
        });
      } else if (session.user.role === 'VOLUNTEER') {
        await prisma.volunteer.update({
          where: { userId: session.user.id },
          data: { image: secureUrl },
        });
      }
    }

    return { error: null };
  } catch (error: unknown) {
    console.error('[uploadAvatar]:', error);
    return { error: 'Greška prilikom upload-a avatara.' };
  }
};
