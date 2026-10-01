import { PaginatedResponse } from '@/types/paginatedResponse.type';
import prisma from '@/lib/prisma';
import { Volunteer } from '@prisma/types';

const DEFAULT_LIMIT = 12;

export const getPaginatedVolunteers = async (
  search: string,
  page: number,
): Promise<PaginatedResponse<Volunteer>> => {
  const where = {
    fullName: {
      contains: search,
      mode: 'insensitive' as const,
    },
  };

  const [volunteers, totalItems] = await Promise.all([
    prisma.volunteer.findMany({
      where,
      skip: (page - 1) * DEFAULT_LIMIT,
      take: DEFAULT_LIMIT,
      orderBy: { workedHours: 'desc' },
    }),
    prisma.volunteer.count({ where }),
  ]);

  return {
    items: volunteers,
    totalItems,
    currentPage: page,
    totalPages: Math.ceil(totalItems / DEFAULT_LIMIT),
  };
};
