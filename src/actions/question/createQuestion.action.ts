'use server';

import { AskQuestionSchemaType } from '@/schemas/askQuestionSchema';
import prisma from '@/lib/prisma';
import { NotificationType } from '@prisma/types';
import { getUserSession } from '@/data/auth/getUserSession';

export const createQuestionAction = async (values: AskQuestionSchemaType, organizerId: string) => {
  try {
    const trimmedEmail = values.email.trim();
    let userId: string | null = null;
    const contactEmail = trimmedEmail || null;
    let senderDisplay = trimmedEmail || 'Gost';

    if (!trimmedEmail) {
      const session = await getUserSession();

      if (!session?.user) {
        return {
          error: 'Za postavljanje pitanja bez email adrese potrebno je da budete prijavljeni.',
        };
      }

      userId = session.user.id;
      senderDisplay =
        session.user.displayUsername ??
        session.user.username ??
        session.user.email ??
        'Registrovani korisnik';
    }

    // Create question
    await prisma.question.create({
      data: {
        title: values.title,
        email: contactEmail,
        userId,
        organizerUserId: organizerId,
      },
    });

    // Send notification to organizer
    await prisma.notification.create({
      data: {
        type: NotificationType.BASIC,
        title: 'Novo pitanje organizaciji',
        message: `${senderDisplay} je postavio pitanje: "${values.title}"${
          contactEmail ? ` | Kontakt: ${contactEmail}` : ''
        }`,
        userId: organizerId,
        link: '/dashboard/org/questions',
      },
    });

    return { error: null };
  } catch (error) {
    console.error('[createQuestionAction] Error creating question:', error);
    return { error: 'Došlo je do greške prilikom slanja pitanja. Pokušajte ponovo.' };
  }
};
