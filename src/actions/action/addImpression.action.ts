'use server';

import { requireVolunteer } from '@/data/auth/requireVolunteer';
import { ImpressionFormSchemaType } from '@/schemas/impressionSchema';

import { revalidatePath } from 'next/cache';

import { NotificationType, ParticipationStatus } from '@prisma/types';
import prisma from '@/lib/prisma';

export const addImpressionToAction = async (values: ImpressionFormSchemaType, actionId: string) => {
  const session = await requireVolunteer();

  try {
    // Proveri da li je korisnik učestvovao u akciji i da li već nije ostavio utisak
    const participation = await prisma.userActionParticipation.findFirst({
      where: {
        actionId,
        userId: session.user.id,
        status: ParticipationStatus.ATTENDED,
      },
    });

    if (!participation) {
      return { error: 'Ne možete ostaviti utisak za akciju u kojoj niste učestvovali.' };
    }

    const existingImpression = await prisma.actionImpression.findFirst({
      where: {
        actionId,
        userId: session.user.id,
      },
    });

    if (existingImpression) {
      return { error: 'Već ste ostavili utisak za ovu akciju.' };
    }

    // Dodaj utisak
    await prisma.actionImpression.create({
      data: {
        actionId,
        userId: session.user.id,
        rating: values.rating,
        comment: values.comment,
      },
    });

    // Posalji notifikaciju organizatoru
    const action = await prisma.action.findUnique({
      where: { id: actionId },
      select: {
        title: true,
        slug: true,
        organizer: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!action) {
      return { error: 'Akcija nije pronađena.' };
    }

    const organizerId = action.organizer.userId;
    const actionTitle = action.title;
    const actionSlug = action.slug;

    // Posalji notifikaciju
    if (organizerId) {
      await prisma.notification.create({
        data: {
          userId: organizerId,
          type: NotificationType.BASIC,
          title: 'Novi utisak za vašu akciju',
          message: `Korisnik ${session.user.name} je ostavio utisak za akciju "${actionTitle}".`,
          link: `/actions/${actionSlug}`,
        },
      });
    }

    // Revalidiraj stranicu akcije da bi se prikazao novi utisak
    revalidatePath(`/actions/${actionSlug}`);

    return { error: null };
  } catch (error) {
    console.error('[addImpressionToAction]', error);
    return { error: 'Došlo je do greške prilikom dodavanja utiska. Pokušajte ponovo.' };
  }
};
