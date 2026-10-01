'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { editDescriptionFormSchema, EditDescriptionFormSchemaType } from '@/schemas/authSchema';
import { requireSession } from '@/data/auth/requireSession';
import prisma from '@/lib/prisma';

export const editProfileDescriptionAction = async (values: EditDescriptionFormSchemaType) => {
  const session = await requireSession();
  if (session.user.role !== 'ORGANIZER') redirect('/');

  const result = editDescriptionFormSchema.safeParse(values);

  if (!result.success) {
    console.log('[editProfileDescriptionAction]:', result.error);
    return { error: 'Nevalidni podaci. Pokušajte ponovo.' };
  }

  const { content } = result.data;

  try {
    await prisma.organizer.update({
      where: { userId: session.user.id },
      data: { description: content },
    });

    revalidatePath('/dashboard/org/profile');

    return { error: null };
  } catch (error) {
    console.error('[editProfileDescriptionAction]:', error);
    return { error: 'Greška prilikom ažuriranja opisa. Pokušajte ponovo.' };
  }
};
