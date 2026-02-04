import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename') || 'file-' + Date.now();

    // ⚠️ The request body is the file stream
    if (!request.body) {
        return NextResponse.json({ error: 'No body provided' }, { status: 400 });
    }

    try {
        const blob = await put(filename, request.body, {
            access: 'public',
        });

        return NextResponse.json(blob);
    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
