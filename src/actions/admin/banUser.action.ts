'use server';

import { requireAdmin } from '@/data/auth/requireAdmin';
import { BanSchemaType } from '@/schemas/banSchema';
import prisma from '@/lib/prisma';
import { sendYouAreBannedEmail } from '@/lib/nodemailer/mailerService';
import { revalidatePath } from 'next/cache';

export const banUserAction = async (values: BanSchemaType, userId: string) => {
  await requireAdmin();

  try {
    // Update the user's ban status in the database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        banned: true,
        banReason: values.reason,
        banExpires: values.durationInSeconds
          ? new Date(Date.now() + values.durationInSeconds * 1000)
          : null,
      },
    });

    if (!updatedUser) {
      return { error: 'Korisnik nije pronađen.' };
    }

    // Revoke all active sessions for the banned user
    await prisma.session.deleteMany({
      where: { userId },
    });

    // Send email notification to the user about the ban
    await sendYouAreBannedEmail(updatedUser.email, values.reason, updatedUser.banExpires);

    revalidatePath('/dashboard/admin/volunteers');
    revalidatePath('/dashboard/admin/organizers');

    return { error: null };
  } catch (err) {
    console.error('[banUser]', err);
    return { error: 'Došlo je do greške prilikom banovanja korisnika.' };
  }
};
