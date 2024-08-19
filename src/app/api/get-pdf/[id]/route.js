import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import PdfModel from '@/models/Pdf'; // Adjust this import based on your project structure

export async function GET(request, { params }) {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);

        // Extract the PDF ID from the request params
        const { id } = params;

        // Find the PDF document by ID
        const pdfDocument = await PdfModel.findById(id);

        if (!pdfDocument) {
            return new NextResponse('PDF not found', { status: 404 });
        }

        // Get the PDF buffer
        const pdfBuffer = pdfDocument.pdf;

        // Return the PDF as a downloadable file
        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=user_details_${id}.pdf`,
            },
        });

    } catch (error) {
        console.error(error); // Log the error for debugging
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    } finally {
        // Ensure that the Mongoose connection is closed properly
        await mongoose.disconnect();
    }
}
