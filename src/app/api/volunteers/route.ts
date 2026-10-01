import { getPaginatedVolunteers } from '@/data/volunteer/getPaginatedVolunteers';
import { NextRequest, NextResponse } from 'next/server';

// /volunteers?search=keyword&page=1
export async function GET(req: NextRequest) {
  try {
    // Get search and page from query parameters
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);

    // Get paginated response
    const response = await getPaginatedVolunteers(search, page);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Greška prilikom pribavljanja blogova' }, { status: 500 });
  }
}
