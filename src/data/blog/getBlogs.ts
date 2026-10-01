import prisma from '@/lib/prisma';

import { BlogWithAuthor } from '@/types/blog.type';
import { PaginatedResponse } from '@/types/paginatedResponse.type';

const DEFAULT_LIMIT = 6;

export const getBlogs = async (
  search: string,
  page: number,
): Promise<PaginatedResponse<BlogWithAuthor>> => {
  const where = {
    title: {
      contains: search,
      mode: 'insensitive' as const,
    },
    isBanned: false, // samo nebanovani blogovi
  };

  const [blogs, totalItems] = await Promise.all([
    prisma.post.findMany({
      where,
      skip: (page - 1) * DEFAULT_LIMIT,
      take: DEFAULT_LIMIT,
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    }),
    prisma.post.count({ where }),
  ]);

  return {
    items: blogs,
    totalItems,
    currentPage: page,
    totalPages: Math.ceil(totalItems / DEFAULT_LIMIT),
  };
};
