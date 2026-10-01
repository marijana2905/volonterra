import { requireSession } from '@/data/auth/requireSession';
import prisma from '@/lib/prisma';
import { Notification } from '@prisma/types';
import type { Prisma } from '@prisma/types';
import { PaginatedResponse } from '@/types/paginatedResponse.type';

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

export const getNotifications = async (
  search = '',
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT,
): Promise<PaginatedResponse<Notification>> => {
  const session = await requireSession();

  const searchTerm = search.trim();
  const where: Prisma.NotificationWhereInput = {
    userId: session.user.id,
    ...(searchTerm
      ? {
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { message: { contains: searchTerm, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const totalItems = await prisma.notification.count({
    where,
  });

  const notifications = await prisma.notification.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
    skip: (page - 1) * limit,
  });

  const items = notifications.map((n) => ({
    ...n,
  }));

  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / limit);

  return {
    items,
    totalItems,
    currentPage: page,
    totalPages,
  };
};
