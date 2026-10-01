'use server';

import { requireOrganizer } from '@/data/auth/requireOrganizer';
import { createSlug, mergeDateAndTime } from '@/lib/utils';
import { ActionFormValues, actionSchema } from '@/schemas/actionSchema';
import { revalidatePath } from 'next/cache';
import { uploadActionBanner } from '../cloudinary/uploadActionBanner';
import prisma from '@/lib/prisma';

export const createAction = async (data: Partial<ActionFormValues>, base64Image: string | null) => {
  const session = await requireOrganizer();

  const result = actionSchema.safeParse(data);

  if (!result.success) {
    console.error('[createAction] Validation failed:', result.error);
    return { error: 'Nevalidni podaci. Pokušajte ponovo.' };
  }

  try {
    // Create slug from title
    const todaysDate = new Date();
    const slug = createSlug(result.data.title) + '-' + todaysDate.toISOString().split('T')[0];

    // Merging date and time into fullDateFrom and fullDateTo
    const fullDateFrom = mergeDateAndTime(result.data.dateRange.from, result.data.startTime);
    const fullDateTo = mergeDateAndTime(result.data.dateRange.to, result.data.endTime);

    // Create action in the database
    const newAction = await prisma.action.create({
      data: {
        title: result.data.title,
        slug,
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
          connect: result.data.categories.map((category) => ({ id: category })),
        },
        organizerUserId: session.user.id,
      },
    });

    // Upload banner image to Cloudinary if provided
    let bannerUrl = null;
    if (base64Image !== null) {
      const { secureUrl, error: uploadError } = await uploadActionBanner(base64Image, newAction.id);
      bannerUrl = secureUrl;

      if (uploadError) {
        console.error('[createAction] Upload error:', uploadError);
        return { error: uploadError };
      }

      // Update action with banner image URL
      await prisma.action.update({
        where: { id: newAction.id },
        data: { bannerImage: bannerUrl },
      });
    }

    // Call BE route to notify users in interest zones (non-blocking)
    fetch(`${process.env.NEXT_PUBLIC_EXPRESS_URL}/notify-zones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lat: newAction.latitude,
        lng: newAction.longitude,
        actionTitle: newAction.title,
        actionSlug: newAction.slug,
      }),
    }).catch((error) => {
      console.error('[createAction] Error notifying zones:', error);
    });

    revalidatePath('/dashboard/org/actions');

    return { error: null };
  } catch (error) {
    console.error('[createAction] Error:', error);
    return { error: 'Greška pri kreiranju akcije. Pokušajte ponovo.' };
  }
};
