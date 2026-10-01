import { NextResponse } from 'next/server';
import { getAllCities } from '@/data/city/getAllCities';

export async function GET() {
  try {
    const result = await getAllCities();

    if (result.error) {
      return NextResponse.json({ error: result.error, cities: null }, { status: 500 });
    }

    const response = NextResponse.json({
      error: null,
      cities: result.cities,
    });

    return response;
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Greška pri učitavanju gradova.', cities: null },
      { status: 500 }
    );
  }
}
