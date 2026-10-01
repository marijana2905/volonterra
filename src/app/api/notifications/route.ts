import { getNotifications } from '@/data/notifications/getNotifications';
import { NextResponse } from 'next/server';

// GET /api/notifications?page=2&search=term
export async function GET(request: Request): Promise<NextResponse> {
  const url = new URL(request.url);
  const pageParam = url.searchParams.get('page');
  const page = pageParam ? parseInt(pageParam, 10) : 1;

  const searchParam = url.searchParams.get('search') || '';

  if (Number.isNaN(page) || page < 1) {
    return NextResponse.json({ error: 'Invalid page' }, { status: 400 });
  }

  const notifications = await getNotifications(searchParam, page);

  return NextResponse.json(notifications);
}
