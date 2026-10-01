'use server';

import { requireAdmin } from '@/data/auth/requireAdmin';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const deleteActionCategory = async (categoryId: string) => {
  await requireAdmin();

  try {
    await prisma.actionCategory.delete({
      where: { id: categoryId },
    });

    revalidatePath('/dashboard/admin/categories');

    return { error: null };
  } catch (error) {
    console.error('[deleteActionCategory] Error deleting action category:', error);
    return { error: 'Došlo je do greške prilikom brisanja kategorije akcije.' };
  }
};
