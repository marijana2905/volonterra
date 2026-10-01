'use server';

import { requireSession } from '@/data/auth/requireSession';
import { accountSchema, AccountSchemaType } from '@/schemas/accountSchema';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const changeNameAndUsernameAction = async (values: AccountSchemaType) => {
  const session = await requireSession();

  const result = accountSchema.safeParse(values);

  if (!result.success) {
    return { error: 'Neispravni podaci za izmenu imena i korisničkog imena.' };
  }

  try {
    // Proveri da li username vec postoji u sistemu
    const existingUser = await prisma.user.findUnique({
      where: { username: result.data.username },
    });

    if (existingUser && existingUser.id !== session.user.id) {
      return { error: 'Korisničko ime je već zauzeto. Molimo izaberite drugo.' };
    }

    // Azuriraj ime i korisnicko ime korisnika
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: result.data.name,
        username: result.data.username,
        displayUsername: result.data.username,
        updatedAt: new Date(),
      },
    });

    // Ako je volonter azuriraj i u tabeli volunter
    if (session.user.role === 'VOLUNTEER') {
      await prisma.volunteer.update({
        where: { userId: session.user.id },
        data: {
          fullName: result.data.name,
          username: result.data.username,
        },
      });
    } else if (session.user.role === 'ORGANIZER') {
      await prisma.organizer.update({
        where: { userId: session.user.id },
        data: {
          organizationName: result.data.name,
          username: result.data.username,
        },
      });
    }

    revalidatePath('/dashboard/vol/settings');
    revalidatePath('/dashboard/org/settings');
    revalidatePath('/dashboard/admin/settings');

    return { error: null };
  } catch (error) {
    console.error('[changeNameAndUsernameAction]', error);
    return {
      error:
        'Došlo je do greške prilikom izmene imena i korisničkog imena. Molimo pokušajte ponovo.',
    };
  }
};
