import prisma from '@/lib/prisma';
import { requireAdmin } from '../auth/requireAdmin';

export const getBannedBlogs = async () => {
  await requireAdmin();

  const bannedBlogs = await prisma.post.findMany({
    where: {
      isBanned: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      author: true,
    },
  });

  return bannedBlogs;
};
