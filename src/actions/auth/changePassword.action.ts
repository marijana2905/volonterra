'use server';

import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { changePasswordSchema, ChangePasswordSchemaType } from '@/schemas/changePasswordSchema';
import { requireSession } from '@/data/auth/requireSession';
import { APIError } from 'better-auth/api';

export const changePasswordAction = async (values: ChangePasswordSchemaType) => {
  await requireSession();

  const result = changePasswordSchema.safeParse(values);

  if (!result.success) {
    return { error: 'Neispravni podaci za promenu lozinke.' };
  }

  try {
    await auth.api.changePassword({
      body: {
        newPassword: result.data.password,
        currentPassword: result.data.currentPassword,
        revokeOtherSessions: true,
      },
      headers: await headers(),
    });

    return { error: null };
  } catch (error) {
    console.error('[changePasswordAction]', error);

    if (error instanceof APIError) {
      switch (error.body?.code) {
        case 'INVALID_PASSWORD':
          return { error: 'Trenutna lozinka je neispravna.' };
      }
    }

    return { error: 'Došlo je do greške prilikom promene lozinke. Molimo pokušajte ponovo.' };
  }
};
