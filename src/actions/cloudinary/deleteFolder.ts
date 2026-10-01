'use server';

import { requireSession } from '@/data/auth/requireSession';
import cloudinary from '@/lib/cloudinary';

export const deleteFolder = async (folderName: string) => {
  await requireSession();

  try {
    await cloudinary.api.delete_resources_by_prefix(folderName, {
      invalidate: true,
    });

    await cloudinary.api.delete_folder(folderName, {
      invalidate: true,
    });
  } catch (error) {
    console.error('[deleteFolder] Error deleting folder and its resources:', error);
  }
};
