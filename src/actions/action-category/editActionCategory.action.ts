'use server';

import { requireAdmin } from '@/data/auth/requireAdmin';
import { createSlug } from '@/lib/utils';
import { ActionCategoryType } from '@/schemas/actionCategorySchema';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const editActionCategory = async (values: ActionCategoryType, categoryId: string) => {
  await requireAdmin();

  try {
    const newSlug = createSlug(values.title);

    await prisma.actionCategory.update({
      where: { id: categoryId },
      data: {
        name: values.title,
        description: values.description,
        slug: newSlug,
      },
    });

    revalidatePath('/dashboard/admin/categories');

    return { error: null };
  } catch (error) {
    console.error('[editActionCategory] Error editing action category:', error);
    return { error: 'Došlo je do greške prilikom uređivanja kategorije akcije.' };
  }
};
