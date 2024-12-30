import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { shareableLink: string } }
) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/forms/shared/${params.shareableLink}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data.data || data);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to fetch form' },
      { status: 500 }
    );
  }
} 