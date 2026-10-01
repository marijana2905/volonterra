'use server';

import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { APIError } from 'better-auth/api';
import { loginFormSchema, LoginFormSchemaType } from '@/schemas/authSchema';

export const loginEmailAction = async (values: LoginFormSchemaType) => {
  const result = loginFormSchema.safeParse(values);

  if (!result.success) {
    console.log('Validation failed:', result.error);
    return { error: 'Nevalidni podaci. Pokušajte ponovo.' };
  }

  const { email, password } = result.data;

  try {
    await auth.api.signInEmail({
      headers: await headers(),
      body: {
        email,
        password,
      },
    });
  } catch (error) {
    if (error instanceof APIError) {
      switch (error.body?.code) {
        case 'BANNED_USER':
          return { error: 'Vaš nalog je banovan. Nemate pristup aplikaciji.' };
        case 'INVALID_EMAIL_OR_PASSWORD':
          return { error: 'Neispravna email adresa ili lozinka.' };
        case 'EMAIL_NOT_VERIFIED':
          return { error: 'Molimo vas da potvrdite svoju email adresu.' };
      }

      return { error: 'Ups! Došlo je do greške prilikom prijavljivanja.' };
    }

    return { error: 'Interna greška servera!' };
  }

  return {
    error: null,
  };
};
