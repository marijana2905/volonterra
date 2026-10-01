import prisma from '@/lib/prisma';

export const getUserTeams = async (userId: string) => {
  // Timovi koje je user kreirao
  const createdTeams = await prisma.team.findMany({
    where: { creatorId: userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      image: true,
      creatorId: true,
      bio: true,
      members: {
        select: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });

  // Timovi gde je samo clan (ali nije creator)
  const memberTeams = await prisma.team.findMany({
    where: {
      members: {
        some: { userId },
      },
      creatorId: { not: userId },
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      image: true,
      creatorId: true,
      bio: true,
      members: {
        select: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });

  return { createdTeams, memberTeams };
};

// export const getUserTeams = async (userId: string) => {
//   // Timovi koje je user kreirao
//   const createdTeams = await prisma.team.findMany({
//     where: { creatorId: userId },
//     orderBy: { createdAt: 'desc' },
//   });

//   // Timovi gde je samo clan (ali nije creator)
//   const memberTeams = await prisma.team.findMany({
//     where: {
//       members: {
//         some: { userId },
//       },
//       creatorId: { not: userId },
//     },
//     orderBy: { createdAt: 'desc' },
//   });

//   return { createdTeams, memberTeams };
// };
