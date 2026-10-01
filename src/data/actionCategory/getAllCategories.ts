import prisma from '@/lib/prisma';

export const getAllCategories = async () => {
  try {
    const categories = await prisma.actionCategory.findMany({
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
      },
    });

    return {
      categories,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      categories: [],
      error: 'Greška pri učitavanju kategorija.',
    };
  }
};
