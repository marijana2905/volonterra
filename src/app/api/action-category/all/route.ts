import { NextResponse } from 'next/server';
import { getAllCategories } from '@/data/actionCategory/getAllCategories';

export async function GET() {
  try {
    const result = await getAllCategories();

    if (result.error) {
      return NextResponse.json({ error: result.error, categories: null }, { status: 500 });
    }

    const response = NextResponse.json({
      error: null,
      categories: result.categories,
    });

    return response;
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Greška pri učitavanju kategorija.', categories: null },
      { status: 500 }
    );
  }
}
