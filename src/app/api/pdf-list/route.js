import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Check if the model already exists before defining it
const PdfModel = mongoose.models.Pdf || mongoose.model('Pdf', new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    address: String,
    age: String,
    department: String,
    designation: String,
    placeOfWork: String,
    pdf: Buffer, // Store the PDF as binary data
}));

export async function GET() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);

        // Fetch all PDF documents
        const pdfs = await PdfModel.find({}, { name: 1, email: 1 });

        // Return the list of PDFs
        return NextResponse.json({ pdfs });

    } catch (error) {
        console.error(error); // Log the error for debugging
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        // Ensure that Mongoose connection is closed properly
        await mongoose.disconnect();
    }
}
