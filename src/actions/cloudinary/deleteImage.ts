'use server';

import cloudinary from '@/lib/cloudinary';

// ex. https://res.cloudinary.com/dxkzy8qqu/image/upload/v1754138091/actions/e1190710-4bcd-402a-b6bc-1ded61e362e2/banner.png
// public_Id is `actions/e1190710-4bcd-402a-b6bc-1ded61e362e2/banner`
export const deleteImage = async (url: string) => {
  // Extract public_id from Cloudinary URL
  const urlParts = url.split('/');
  const uploadIndex = urlParts.findIndex(part => part === 'upload');

  if (uploadIndex === -1 || uploadIndex + 2 >= urlParts.length) {
    throw new Error('Invalid Cloudinary URL format');
  }

  // Get everything after version number as public_id (including folder structure)
  const publicIdWithExtension = urlParts.slice(uploadIndex + 2).join('/');

  // Remove file extension from public_id
  const public_id = publicIdWithExtension.replace(/\.[^/.]+$/, '');

  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    throw new Error(`Failed to delete image: ${error}`);
  }
};
