import { VolunteerListItem } from '@/types/volunteer.type';
import prisma from '@/lib/prisma';

export const getAllVolunteers = async () => {
  const volunteers = await prisma.volunteer.findMany({
    select: {
      userId: true,
      email: true,
      fullName: true,
      username: true,
      image: true,
    },
  });

  return volunteers as VolunteerListItem[];
};
