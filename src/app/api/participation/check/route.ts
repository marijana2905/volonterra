import { NextRequest } from 'next/server';
import { requireSession } from '@/data/auth/requireSession';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const session = await requireSession();

  if (!session || session.user.role !== 'VOLUNTEER') {
    return new Response(JSON.stringify({ success: false }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { actionId } = await request.json();

    if (!actionId) {
      return new Response(JSON.stringify({ success: false }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const participation = await prisma.userActionParticipation.findUnique({
      where: {
        userId_actionId: {
          userId: session.user.id,
          actionId,
        },
      },
      select: {
        status: true,
        type: true,
      },
    });

    return new Response(JSON.stringify({ success: !!participation }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[CHECK_PARTICIPATION] Error:', error);
    return new Response(JSON.stringify({ success: false }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
