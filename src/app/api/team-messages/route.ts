import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/team-messages?teamId=...&cursor=...
// Returns latest 20 messages (newest first internally) then reversed for chronological order.
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get('teamId');
    const cursor = searchParams.get('cursor'); // ISO of oldest currently loaded message
    const take = 10;

    if (!teamId) {
      return new Response(JSON.stringify({ error: 'teamId is required' }), { status: 400 });
    }

    const where: any = { teamId };
    if (cursor) {
      const cursorDate = new Date(cursor);
      if (!isNaN(cursorDate.getTime())) {
        where.createdAt = { lt: cursorDate };
      }
    }

    const rows = await prisma.chatMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take,
      include: { user: true },
    });

    const messages = rows
      .slice()
      .reverse()
      .map((r) => ({
        id: r.id,
        name: (r.user.username as string | null) || r.user.name || 'Nepoznat',
        text: r.content,
        time: r.createdAt.toISOString(),
      }));

    const oldest = rows.at(-1);
    const nextCursor = rows.length === take && oldest ? oldest.createdAt.toISOString() : null;

    return new Response(JSON.stringify({ messages, nextCursor }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('GET /api/team-messages error', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
