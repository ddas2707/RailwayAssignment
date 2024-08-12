// src/app/api/admin/getPdfLinks/route.js
import { NextResponse } from 'next/server';
import { getAllPdfLinks } from '../../../lib/userHandler'; // Adjust path as needed

export async function GET() {
    try {
        const pdfLinks = await getAllPdfLinks();
        return NextResponse.json({ pdfLinks });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch PDF links' }, { status: 500 });
    }
}
