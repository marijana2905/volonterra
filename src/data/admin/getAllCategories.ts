import prisma from '@/lib/prisma';

export const getAllCategories = async () => {
  const categories = await prisma.actionCategory.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      _count: {
        select: { actions: true },
      },
    },
  });

  return categories.map((category) => {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      count: category._count.actions,
    };
  });
};
