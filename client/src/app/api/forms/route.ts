import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    console.log('API route received:', formData);

    const response = await fetch('http://localhost:5000/api/forms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    console.log('Backend response:', data);

    if (!response.ok) {
      console.error('Backend error:', data);
      return NextResponse.json(data, { status: response.status });
    }

    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { message: 'Invalid response format from server' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to save form' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log('Client API route: Starting fetch');
    const response = await fetch('http://localhost:5000/api/forms', {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    console.log('Client API route: Response status:', response.status);

    if (!response.ok) {
      const error = await response.json();
      console.error('Client API route: Server error:', error);
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    console.log('Client API route: Raw data:', data);

    // Handle axios response format
    const formsData = data.data || data;

    if (!Array.isArray(formsData)) {
      console.error('Client API route: Expected array but got:', typeof formsData);
      return NextResponse.json(
        { message: 'Invalid data format from server' },
        { status: 500 }
      );
    }

    return NextResponse.json(formsData);
  } catch (error) {
    console.error('Client API route: Fetch error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to fetch forms' },
      { status: 500 }
    );
  }
} 