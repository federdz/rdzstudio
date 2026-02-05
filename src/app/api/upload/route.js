import { handleUpload } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request) {
    const body = await request.json();

    try {
        const jsonResponse = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async (pathname) => {
                // AQUÍ es donde el servidor autoriza la subida y define las reglas
                return {
                    allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'application/pdf'],
                    tokenPayload: JSON.stringify({}),
                    // ESTA LÍNEA ES CLAVE: El servidor agrega un sufijo random para que no haya duplicados
                    addRandomSuffix: true,
                };
            },
            onUploadCompleted: async ({ blob, tokenPayload }) => {
                console.log('Subida completada en Vercel:', blob.url);
            },
        });

        return NextResponse.json(jsonResponse);
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 400 },
        );
    }
}