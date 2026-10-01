'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { canEditAction, createSlug, mergeDateAndTime } from '@/lib/utils';
import { ActionFormValues, actionSchema } from '@/schemas/actionSchema';
import { uploadActionBanner } from '@/actions/cloudinary/uploadActionBanner';
import { requireOrganizer } from '@/data/auth/requireOrganizer';
import { deleteImage } from '../cloudinary/deleteImage';

export const editAction = async (
  id: string,
  data: Partial<ActionFormValues>,
  base64Image: string | null,
  isNewBanner: boolean = false,
  isDeletedImage: boolean = false,
) => {
  await requireOrganizer();

  // Form validation
  const result = actionSchema.safeParse(data);

  if (!result.success) {
    console.error('[editAction] Validation failed:', result.error);
    return { error: 'Nevalidni podaci. Pokušajte ponovo.' };
  }

  // If no id is provided, return error
  const action = await prisma.action.findUnique({
    where: { id },
  });

  if (!action) {
    return { error: 'Akcija nije pronađena.' };
  }

  // Check if action can be edited
  if (!canEditAction(action.fullDateFrom, action.status)) {
    return { error: 'Akciju je moguće urediti najkasnije 2 dana pre početka.' };
  }

  try {
    // Create new slug if title is changed
    const oldSlug = action.slug;
    let newSlug = null;
    if (action.title !== result.data.title) {
      const todaysDate = new Date();
      newSlug = createSlug(result.data.title) + '-' + todaysDate.toISOString().split('T')[0];
    }

    // Delete from cloudinary in background
    if (isDeletedImage && !isNewBanner && action.bannerImage) {
      deleteImage(action.bannerImage);
    }

    // Upload banner image to Cloudinary if provided
    let bannerUrl = null;
    if (isNewBanner && base64Image !== null) {
      const { secureUrl, error: uploadError } = await uploadActionBanner(base64Image, action.id);
      bannerUrl = secureUrl;

      if (uploadError) {
        console.error('[createAction] Upload error:', uploadError);
        return { error: uploadError };
      }
    }

    // Update action in the database
    // TODO: fix type

    // Merging date and time into fullDateFrom and fullDateTo
    const fullDateFrom = mergeDateAndTime(result.data.dateRange.from, result.data.startTime);
    const fullDateTo = mergeDateAndTime(result.data.dateRange.to, result.data.endTime);

    const updateData: any = {
      title: result.data.title,
      description: result.data.description,
      latitude: result.data.latitude,
      longitude: result.data.longitude,
      city: result.data.city,
      address: result.data.address,
      startTime: result.data.startTime,
      endTime: result.data.endTime,
      fullDateFrom,
      fullDateTo,
      minParticipants: result.data.minParticipants,
      maxParticipants: result.data.maxParticipants,
      categories: {
        set: result.data.categories.map((category) => ({ id: category })),
      },
      slug: newSlug ?? oldSlug,
    };

    // If a new banner image is provided, update the bannerImage field with new public url
    if (isNewBanner) {
      updateData.bannerImage = bannerUrl;
    } else if (isDeletedImage) {
      updateData.bannerImage = null;
    }

    await prisma.action.update({
      where: { id },
      data: updateData,
    });

    // TODO: Email notifikacije svim prijavljenim korisnicima samo ako su promenjene neke bitne infromacije (vreme, mesto) (background job, express, queue...)

    revalidatePath('/dashboard/org/actions');

    return { error: null };
  } catch (error) {
    console.error('[editAction] Error:', error);
    return { error: 'Došlo je do greške prilikom uređivanja akcije. Pokušajte ponovo.' };
  }
};
