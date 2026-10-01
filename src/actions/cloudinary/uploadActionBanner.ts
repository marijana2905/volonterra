'use server';

import { requireOrganizer } from '@/data/auth/requireOrganizer';
import cloudinary from '@/lib/cloudinary';

export const uploadActionBanner = async (base64Image: string, actionId: string) => {
  await requireOrganizer();

  const BANNER_UPLOAD_PRESET = process.env.CLOUDINARY_ACTION_BANNER_UPLOAD_PRESET;

  try {
    // Preset is defined in cloudinary settings and quality is auto so it will handle the optimization during upload
    const result = await cloudinary.uploader.upload(base64Image, {
      upload_preset: BANNER_UPLOAD_PRESET,
      public_id: `banner`,
      folder: `actions/${actionId}`,
    });

    // public_id ce da bude `actions/${actionId}/banner`

    const secureUrl = result.secure_url;

    return { secureUrl, error: null };
  } catch (error: unknown) {
    console.error('[uploadActionBanner]:', error);
    return { error: 'Greška prilikom upload-a banera.', secureUrl: null };
  }
};
