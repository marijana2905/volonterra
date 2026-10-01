'use server';

import { ReplyQuestionSchemaType } from '@/schemas/askQuestionSchema';
import prisma from '@/lib/prisma';
import { NotificationType } from '@prisma/types';
import { requireSession } from '@/data/auth/requireSession';
import { sendReplyToQuestionEmail } from '@/lib/nodemailer/mailerService';
import { revalidatePath } from 'next/cache';

export const replyQuestionAction = async (values: ReplyQuestionSchemaType, questionId: string) => {
  const session = await requireSession();

  try {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { user: true },
    });

    if (!question) {
      return { error: 'Pitanje nije pronađeno.' };
    }

    // Create message (TODO: mozda dodati transakcije ako se desi greska u slanju mejla)
    await prisma.questionMessage.create({
      data: {
        content: values.content,
        questionId: question.id,
        senderUserId: session.user.id,
      },
    });

    // Ako je pitanje postavio registrovani korisnik
    if (question.userId) {
      if (session.user.id === question.userId) {
        // Volonter salje poruku u razgovoru na pitanje (notifikacija ide organizatoru)
        await prisma.notification.create({
          data: {
            userId: question.organizerUserId,
            type: NotificationType.BASIC,
            title: 'Novi odgovor na pitanje',
            message: `${session.user.name} je poslao/la poruku na pitanje: "${question.title}"`,
            link: '/dashboard/org/questions',
          },
        });
      } else {
        // Organizator salje odgovor na pitanje (notifikacija ide volonteru)
        await prisma.notification.create({
          data: {
            userId: question.userId,
            type: NotificationType.BASIC,
            title: 'Novi odgovor na pitanje',
            message: `${session.user.name} je poslao/la odgovor na vaše pitanje: "${question.title}"`,
            link: '/dashboard/vol/questions',
          },
        });
      }

      revalidatePath('/dashboard/org/questions');
      revalidatePath('/dashboard/vol/questions');

      return { error: null };
    } else {
      // Ako je neregistrovani korisnik posalji mu mejl i zakljucaj pitanje kao odgovoreno
      const { success } = await sendReplyToQuestionEmail(
        question.email!,
        question.title,
        session.user.name,
        session.user.email,
        values.content,
      );

      if (!success) {
        return { error: 'Došlo je do greške prilikom slanja emaila. Pokušajte ponovo.' };
      } else {
        // Zakljucaj pitanje
        await prisma.question.update({
          where: { id: question.id },
          data: { closed: true },
        });

        revalidatePath('/dashboard/org/questions');

        return { error: null };
      }
    }
  } catch (error) {
    console.error('[replyQuestionAction] Error replying to question:', error);
    return { error: 'Došlo je do greške prilikom slanja odgovora. Pokušajte ponovo.' };
  }
};
