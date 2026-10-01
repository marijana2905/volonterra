import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const organizations = await prisma.organizer.findMany({
    select: {
      userId: true,
      organizationName: true,
      username: true,
      image: true,
    },
  });

  return NextResponse.json(organizations, { status: 200 });
}
