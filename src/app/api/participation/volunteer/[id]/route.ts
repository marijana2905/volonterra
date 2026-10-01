import { getVolunteerParticipations } from '@/data/volunteer/getVolunteerParticipations';
import { NextRequest } from 'next/server';

// Vraca sve prijave volontera na akcije
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const data = await getVolunteerParticipations(id);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[GET_VOLUNTEER_PARTICIPATION] Error:', error);
    return new Response(JSON.stringify({ success: false }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
