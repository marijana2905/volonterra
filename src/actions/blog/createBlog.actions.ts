'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { blogFormSchema, BlogFormSchemaType } from '@/schemas/blogSchema';
import { createSlug } from '@/lib/utils';
import { requireSession } from '@/data/auth/requireSession';

export const createBlog = async (data: BlogFormSchemaType) => {
  const session = await requireSession();
  if (!session || !session.user) {
    return { error: 'Morate biti prijavljeni da biste dodali blog.' };
  }

  const result = blogFormSchema.safeParse(data);
  if (!result.success) {
    console.error('[createBlog] Validation failed:', result.error);
    return { error: 'Nevalidni podaci. Pokušajte ponovo.' };
  }

  try {
    const slug = createSlug(result.data.title);

    const newBlog = await prisma.post.create({
      data: {
        title: result.data.title,
        slug,
        content: result.data.content,
        image: null, // za sada bez slike
        keywords: result.data.keywords,
        authorId: session.user.id,
      },
    });

    revalidatePath('/blogs');

    return { error: null, blog: newBlog };
  } catch (err) {
    console.error('[createBlog] Error:', err);
    return { error: 'Greška pri kreiranju bloga. Pokušajte ponovo.' };
  }
};
