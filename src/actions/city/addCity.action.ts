'use server';

import { requireSession } from '@/data/auth/requireSession';
import prisma from '@/lib/prisma';

export const addCityAction = async (cityName: string) => {
  await requireSession();

  try {
    const newCity = await prisma.city.create({
      data: {
        name: cityName,
      },
    });

    return { error: null, city: newCity.name };
  } catch (error) {
    console.error('[addCity]:', error);
    return { error: 'Greška prilikom kreiranja grada', city: null };
  }
};
