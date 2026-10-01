'use server';

import { requireAdmin } from '@/data/auth/requireAdmin';
import { createSlug } from '@/lib/utils';
import { ActionCategoryType } from '@/schemas/actionCategorySchema';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const createActionCategory = async (values: ActionCategoryType) => {
  await requireAdmin();

  try {
    const slug = createSlug(values.title);

    await prisma.actionCategory.create({
      data: {
        name: values.title,
        description: values.description,
        slug: slug,
      },
    });

    revalidatePath('/dashboard/admin/categories');

    return { error: null };
  } catch (error) {
    console.error('[createActionCategory] Error creating action category:', error);
    return { error: 'Došlo je do greške prilikom kreiranja kategorije akcije.' };
  }
};
