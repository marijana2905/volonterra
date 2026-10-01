import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

// GET /api/volunteer/:id/teams
// Vraca sve timove ciji je korisnik sa id-em vlasnik (kreator tima)
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const teams = await prisma.team.findMany({
      where: { creatorId: id },
      select: {
        id: true,
        name: true,
      },
    });

    return new Response(JSON.stringify({ success: true, data: teams }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
