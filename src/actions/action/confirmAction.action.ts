'use server';

import { requireOrganizer } from '@/data/auth/requireOrganizer';
import { badgeNames, badgeRules } from '@/lib/utils';

import prisma from '@/lib/prisma';
import { ActionStatus, NotificationType, ParticipationStatus } from '@/generated/prisma/enums';

export const confirmAction = async (actionId: string, userIds: string[]) => {
  await requireOrganizer();

  if (!userIds.length) return { error: 'Nema odabranih korisnika' };

  try {
    // Sve radnje se izvrsavaju kao transakcija: ili sve uspe ili nista
    await prisma.$transaction(async (tx) => {
      // 1) Procitaj akciju da izracunamo broj poena (trajanje u satima) i za link/poruku
      const action = await tx.action.findUnique({
        where: { id: actionId },
        select: {
          id: true,
          title: true,
          slug: true,
          fullDateFrom: true,
          fullDateTo: true,
        },
      });
      if (!action) {
        throw new Error('Akcija nije pronađena');
      }

      const from =
        action.fullDateFrom instanceof Date ? action.fullDateFrom : new Date(action.fullDateFrom);
      const to =
        action.fullDateTo instanceof Date ? action.fullDateTo : new Date(action.fullDateTo);
      const durationMs = to.getTime() - from.getTime();
      // Minimalno 1 poen, zaokruzujemo na najblizi sat
      const earnedPoints = Math.max(1, Math.round(durationMs / (1000 * 60 * 60)));

      // 2) Promeni statuse prijava selektovanih korisnika na ATTENDED
      const upd = await tx.userActionParticipation.updateMany({
        where: {
          actionId,
          userId: { in: userIds },
        },
        data: {
          status: ParticipationStatus.ATTENDED,
        },
      });
      console.log('[confirmAction] Updated participations:', upd.count);

      // 3) Nadji stvarno pogodjene korisnike (koji imaju prijavu za ovu akciju)
      const updatedParticipants = await tx.userActionParticipation.findMany({
        where: { actionId, userId: { in: userIds } },
        select: { userId: true },
        distinct: ['userId'],
      });
      const affectedUserIds = updatedParticipants.map((p) => p.userId);

      // 4) Promeni status akcije na COMPLETED
      await tx.action.update({
        where: { id: actionId },
        data: { status: ActionStatus.COMPLETED },
      });

      // 5) Povećaj poene (workedHours) volonterima
      if (affectedUserIds.length) {
        const incRes = await tx.volunteer.updateMany({
          where: { userId: { in: affectedUserIds } },
          data: { workedHours: { increment: earnedPoints } },
        });

        console.log(
          '[confirmAction] Incremented volunteer workedHours for',
          incRes.count,
          'users by',
          earnedPoints,
        );

        // 6) Pošalji notifikacije korisnicima
        await tx.notification.createMany({
          data: affectedUserIds.map((uid) => ({
            userId: uid,
            type: NotificationType.BASIC,
            title: 'Uspešno odrađena akcija',
            message: `Bravo! Za akciju "${action.title}" osvojili ste ${earnedPoints} poena.`,
            link: action.slug ? `/actions/${action.slug}` : undefined,
            metadata: { actionId: action.id, points: earnedPoints, title: action.title },
          })),
        });
      }
    });

    // 5.1) Dodeli novi bedz ako je ovom akcijom volonter dostigao neki novi nivo (non blocking)
    updateBadges(userIds);

    return { error: null };
  } catch (error) {
    console.error('[confirmAction]', error);
    return { error: 'Greška prilikom potvrde akcije' };
  }
};

const updateBadges = async (userIds: string[]) => {
  // Prodji kroz sve volontere i azuriraj im bedzeve na osnovu broja odradjenih akcija
  try {
    if (!userIds.length) return;

    // Dohvati korisnike sa brojem odrađenih (ATTENDED) akcija i trenutnim badgeLevel-om
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        volunteer: { select: { userId: true, badgeLevel: true } },
        participations: {
          where: { status: ParticipationStatus.ATTENDED },
          select: { actionId: true },
        },
      },
    });

    // Pripremi listu ažuriranja samo za one kojima raste nivo
    const updates = users
      .map((u) => {
        const attendedCount = u.participations.length;

        // Izracunaj novi nivo: najveci indeks ciji je prag <= attendedCount, nivo = indeks + 1
        let newLevel = 1;
        for (const [idx, threshold] of badgeRules.entries()) {
          if (attendedCount >= threshold) newLevel = idx + 1;
        }

        const currentLevel = u.volunteer?.badgeLevel ?? 1;
        if (!u.volunteer) return null; // nije volonter
        if (newLevel > currentLevel) {
          return { userId: u.id, newLevel };
        }
        return null;
      })
      .filter((x): x is { userId: string; newLevel: number } => Boolean(x));

    if (!updates.length) return;

    await prisma.$transaction(async (tx) => {
      // 1) Ažuriraj badgeLevel za svakog korisnika
      for (const upd of updates) {
        await tx.volunteer.update({
          where: { userId: upd.userId },
          data: { badgeLevel: upd.newLevel },
        });
      }

      // 2) Pošalji notifikacije o novom nivou bedža
      await tx.notification.createMany({
        data: updates.map((upd) => ({
          userId: upd.userId,
          type: NotificationType.BASIC,
          title: 'Novi nivo bedža',
          message: `Čestitamo! Dostigli ste nivo ${upd.newLevel} - ${
            badgeNames[upd.newLevel - 1] ?? 'Novi nivo'
          }.`,
          metadata: {
            badgeLevel: upd.newLevel,
            badgeName: badgeNames[upd.newLevel - 1] ?? undefined,
          },
        })),
      });
    });

    console.log('[updateBadges] Updated badge levels and sent notifications for users:', updates);
  } catch (err) {
    // Ne blokirati glavnu akciju ako dodela bedzeva padne
    console.error('[updateBadges] Failed to update badges:', err);
  }
};
