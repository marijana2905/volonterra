import prisma from '@/lib/prisma';
import { requireAdmin } from '../auth/requireAdmin';

export const getStatisticForAdmin = async () => {
  await requireAdmin();

  const [volunteers, organizers, actions, blogs] = await Promise.all([
    prisma.volunteer.count(),
    prisma.organizer.count(),
    prisma.action.count(),
    prisma.post.count(),
  ]);

  return {
    volunteers,
    organizers,
    actions,
    blogs,
  };
};
