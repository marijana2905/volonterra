'use server';

import { auth } from '@/lib/auth';
import { APIError } from 'better-auth/api';
import { registerFormSchema, RegisterFormSchemaType } from '@/schemas/authSchema';
import prisma from '@/lib/prisma';
import { NotificationType, UserRole } from '@prisma/types';

export const registerEmailAction = async (values: RegisterFormSchemaType) => {
  const result = registerFormSchema.safeParse(values);

  if (!result.success) {
    console.log('[registerEmailAction]:', result.error);
    return { error: 'Nevalidni podaci. Pokuštajte ponovo.' };
  }

  const { userType, name, username, email, password } = result.data;
  const cleanedName = name.replace(/\s+/g, ' ').trim();

  try {
    const response = await auth.api.signUpEmail({
      body: {
        name: cleanedName,
        email: email,
        password: password,
        username: username,
        role: userType === 'volunteer' ? 'VOLUNTEER' : 'ORGANIZER',
      },
    });

    // Kreiranje Volontera/Organizatora u bazi
    const user = response.user;

    if (!user || !user.id) {
      return { error: 'Greška prilikom kreiranja korisnika.' };
    }

    const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(';') || [];
    const intendedRole: UserRole = userType === 'volunteer' ? 'VOLUNTEER' : 'ORGANIZER';
    if (!ADMIN_EMAILS.includes(email)) {
      await prisma.user.update({ where: { id: user.id }, data: { role: intendedRole } });
    }

    if (userType === 'volunteer') {
      await prisma.volunteer.create({
        data: {
          userId: user.id,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          fullName: cleanedName,
          email,
          username,
        },
      });
    } else {
      await prisma.organizer.create({
        data: {
          userId: user.id,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          organizationName: cleanedName,
          email,
          username,
        },
      });
    }

    // Posalji welcome notifikaciju (non-blocking)
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Dobrodošli u na VolonTerru!',
        message:
          'Hvala što ste se pridružili našoj zajednici volontera i organizatora. Zajedno možemo činiti velike stvari!',
        type: NotificationType.BASIC,
      },
    });
  } catch (error) {
    if (error instanceof APIError) {
      const errorCode = error.body ? error.body.code : 'UNKNOWN';

      switch (errorCode) {
        case 'USER_ALREADY_EXISTS':
          return { error: 'Ovaj mejl je već iskorišćen.' };
        case 'USERNAME_IS_ALREADY_TAKEN_PLEASE_TRY_ANOTHER':
          return { error: 'Korisničko ime je već zauzeto.' };
        case 'PASSWORD_TOO_SHORT':
          return { error: 'Lozinka je prekratka. Pokušajte ponovo.' };
        default:
          return { error: 'Ups! Došlo je do greške prilikom registracije.' };
      }
    }

    return { error: 'Interna greška servera!' };
  }

  return { error: null };
};
