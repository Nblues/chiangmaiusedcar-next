// API route for on-demand revalidation
// Usage: POST /api/revalidate?secret=YOUR_SECRET&tag=home
// This allows selective cache invalidation when content updates

import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const tag = searchParams.get('tag');
    const path = searchParams.get('path');

    // Verify secret to prevent abuse
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { message: 'Invalid secret' }, 
        { status: 401 }
      );
    }

    // Revalidate by tag (recommended approach)
    if (tag) {
      revalidateTag(tag);
      return NextResponse.json({ 
        revalidated: true, 
        tag,
        timestamp: new Date().toISOString()
      });
    }

    // Revalidate by path (alternative approach)
    if (path) {
      // For Pages Router compatibility
      const revalidatePath = await import('next/cache').then(m => m.revalidatePath);
      revalidatePath(path);
      return NextResponse.json({ 
        revalidated: true, 
        path,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { message: 'Missing tag or path parameter' }, 
      { status: 400 }
    );

  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { message: 'Error revalidating cache' }, 
      { status: 500 }
    );
  }
}

// Also support GET for testing
export async function GET(request: Request) {
  return NextResponse.json({
    message: 'Revalidation API is working',
    usage: 'POST /api/revalidate?secret=YOUR_SECRET&tag=CACHE_TAG',
    example: 'curl -X POST "/api/revalidate?secret=xyz&tag=home"',
  });
}
