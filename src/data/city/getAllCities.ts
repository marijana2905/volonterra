import prisma from '@/lib/prisma';

export const getAllCities = async () => {
  try {
    const cities = await prisma.city.findMany({
      orderBy: {
        name: 'asc',
      },
      select: {
        name: true,
      },
    });

    return {
      error: null,
      cities: cities.map((city) => city.name),
    };
  } catch (error) {
    console.error('Error fetching cities:', error);
    return {
      error: 'Greška pri učitavanju gradova.',
      cities: [],
    };
  }
};
