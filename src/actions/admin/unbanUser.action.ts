'use server';

import { requireAdmin } from '@/data/auth/requireAdmin';
import prisma from '@/lib/prisma';
import { sendYourAreUnbannedEmail } from '@/lib/nodemailer/mailerService';
import { revalidatePath } from 'next/cache';

export const unBanUser = async (userId: string) => {
  await requireAdmin();

  try {
    // Update the user's ban status in the database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        banned: null,
        banReason: null,
        banExpires: null,
      },
    });

    if (!updatedUser) {
      return { error: 'Korisnik nije pronađen.' };
    }

    // Send email
    await sendYourAreUnbannedEmail(updatedUser.email);

    revalidatePath('/dashboard/admin/volunteers');
    revalidatePath('/dashboard/admin/organizers');

    return { error: null };
  } catch (err) {
    console.error('[unBanUser]', err);
    return { error: 'Došlo je do greške prilikom ukidanja bana korisniku.' };
  }
};
