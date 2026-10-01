import prisma from '@/lib/prisma';
import { requireVolunteer } from '../auth/requireVolunteer';

export const getVolunteerZones = async () => {
  const session = await requireVolunteer();

  const zones = await prisma.interestZone.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
      name: true,
      latitude: true,
      longitude: true,
      radius: true,
    },
  });

  return zones;
};
