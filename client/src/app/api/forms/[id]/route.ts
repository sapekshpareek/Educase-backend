import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Client API route: Fetching form:', params.id);
    const response = await fetch(`http://localhost:5000/api/forms/${params.id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    const data = await response.json();
    console.log('Form data from backend:', data);

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Form fetch error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to fetch form' },
      { status: 500 }
    );
  }
} 