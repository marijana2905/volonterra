import { addCityAction } from '@/actions/city/addCity.action';
import { requireSession } from '@/data/auth/requireSession';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  await requireSession();

  const { cityName } = await request.json();

  const { error, city } = await addCityAction(cityName);

  if (error) {
    return new Response(error, { status: 500 });
  }

  return new Response(JSON.stringify(city), { status: 200 });
}
