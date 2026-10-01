import prisma from '@/lib/prisma';
import { requireAdmin } from '../auth/requireAdmin';

export const getAllVolunteersForAdmin = async () => {
  await requireAdmin();

  const volunteers = await prisma.volunteer.findMany({
    include: {
      user: true,
    },
  });

  return volunteers;
};
