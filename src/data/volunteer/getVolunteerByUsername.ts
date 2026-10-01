import prisma from '@/lib/prisma';
import { VolunteerListItem } from '@/types/volunteer.type';

export async function getVolunteerByUsername(username: string) {
  const volunteer = await prisma.volunteer.findUnique({
    where: { username },
    include: {
      user: true,
    },
  });

  return volunteer as VolunteerListItem | null;
}
