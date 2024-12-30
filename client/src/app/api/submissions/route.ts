import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const submissionData = await request.json();

    const response = await fetch('http://localhost:5000/api/submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to submit form' },
      { status: 500 }
    );
  }
} 