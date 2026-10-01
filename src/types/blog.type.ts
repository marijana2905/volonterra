import { User, Post } from '@prisma/types';

export type BlogWithAuthor = Post & {
  author: User | null;
};

export type CommentWithAuthor = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: User | null;
  parentId: string | null;
  parent: {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    essayId: string | null;
    authorId: string | null;
    parentId: string | null;
  } | null;
};
