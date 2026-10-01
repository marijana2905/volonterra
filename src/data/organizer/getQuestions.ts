import prisma from '@/lib/prisma';
import { requireOrganizer } from '../auth/requireOrganizer';
import { requireVolunteer } from '../auth/requireVolunteer';

export const getQuestions = async () => {
  const session = await requireOrganizer();

  const questions = await prisma.question.findMany({
    where: {
      organizerUserId: session.user.id,
    },
    include: {
      user: true,
      messages: {
        include: {
          senderUser: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return questions;
};

export const getVolunteerQuestions = async () => {
  const session = await requireVolunteer();

  const questions = await prisma.question.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      user: true,
      messages: {
        include: {
          senderUser: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return questions;
};
