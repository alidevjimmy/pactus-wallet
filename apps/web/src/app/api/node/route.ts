import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url, method, params } = await request.json();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method,
          params,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return NextResponse.json(
          { error: 'Node is not accessible' },
          { status: 503 }
        );
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return NextResponse.json(
            { error: 'Request timeout' },
            { status: 504 }
          );
        }
      }
      throw error; // Re-throw other errors to be caught by outer try-catch
    }
  } catch (error) {
    console.error('Error in node API route:', error);
    return NextResponse.json(
      { error: 'Failed to connect to node' },
      { status: 503 }
    );
  }
}
