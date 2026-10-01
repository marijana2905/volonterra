'use server';

import prisma from '@/lib/prisma';
import { BlogFormSchemaType } from '@/schemas/blogSchema';
import { requireSession } from '@/data/auth/requireSession';
import { revalidatePath } from 'next/cache';

export async function editBlog(values: BlogFormSchemaType, id: string) {
  const session = await requireSession();

  try {
    const blog = await prisma.post.findUnique({ where: { id } });

    if (!blog) {
      return { error: 'Blog nije pronađen.' };
    }

    if (blog.authorId !== session.user.id && session.user.role !== 'ADMIN') {
      return { error: 'Nemate dozvolu da izmenite ovaj blog.' };
    }

    await prisma.post.update({
      where: { id },
      data: {
        title: values.title,
        content: values.content,
        image: values.imageUrl || null,
        keywords: values.keywords,
      },
    });

    revalidatePath(`/blogs/${blog.slug}`);

    return { error: null };
  } catch (error) {
    console.error('[editBlog] Error:', error);
    return { error: 'Došlo je do greške prilikom izmene bloga.' };
  }
}
