import prisma from '@/lib/prisma';
import { requireAdmin } from '../auth/requireAdmin';

export const getAllOrganizersForAdmin = async () => {
  await requireAdmin();

  const organizers = await prisma.organizer.findMany({
    include: {
      user: true,
    },
  });

  return organizers;
};
