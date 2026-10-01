import prisma from '@/lib/prisma';

export async function getBlogBySlug(slug: string) {
  return prisma.post.findUnique({
    where: { slug },
    include: {
      author: true,
      comments: {
        orderBy: { createdAt: 'desc' },
        include: {
          author: true,
        },
      },
    },
  });
}
