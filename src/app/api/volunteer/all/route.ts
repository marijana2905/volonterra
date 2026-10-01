import { getAllVolunteers } from '@/data/volunteer/getAllVolunteers';
import { NextResponse } from 'next/server';

// GET /api/volunteer/all
export async function GET() {
  const users = await getAllVolunteers();

  return NextResponse.json(users);
}
