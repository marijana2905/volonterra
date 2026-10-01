'use server';

import { requireSession } from '@/data/auth/requireSession';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type OrganizerField =
  | 'phone'
  | 'address'
  | 'website'
  | 'facebookLink'
  | 'instagramLink'
  | 'xLink'
  | 'paypalLink'
  | 'bankAccount';

export const updateOrganizerFieldAction = async (field: OrganizerField, newValue: string) => {
  const session = await requireSession();
  if (session.user.role !== 'ORGANIZER') redirect('/');

  try {
    await prisma.organizer.update({
      where: { userId: session.user.id },
      data: { [field]: newValue },
    });

    revalidatePath('/dashboard/org/profile');

    return { error: null };
  } catch (error) {
    console.error(`[updateOrganizerField-${field}]:`, error);
    return { error: `Greška prilikom izmene. Pokušajte ponovo.` };
  }
};
