import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import User from '../../../models/User';
import { PDFDocument, rgb } from 'pdf-lib';

export async function POST(req) {
    try {
        await connectToDatabase();

        const { name, email, phone, address, age, department, designation, placeOfWork } = await req.json();

        // Generate PDF
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 500]);
        const { width, height } = page.getSize();
        const fontSize = 20;

        page.drawText(`Name: ${name}`, { x: 50, y: height - 7 * fontSize, size: fontSize, color: rgb(0, 0, 0) });
        page.drawText(`Email: ${email}`, { x: 50, y: height - 8 * fontSize, size: fontSize, color: rgb(0, 0, 0) });
        page.drawText(`Phone: ${phone}`, { x: 50, y: height - 9 * fontSize, size: fontSize, color: rgb(0, 0, 0) });
        page.drawText(`Address: ${address}`, { x: 50, y: height - 10 * fontSize, size: fontSize, color: rgb(0, 0, 0) });
        page.drawText(`Age: ${age}`, { x: 50, y: height - 11 * fontSize, size: fontSize, color: rgb(0, 0, 0) });
        page.drawText(`Department: ${department}`, { x: 50, y: height - 12 * fontSize, size: fontSize, color: rgb(0, 0, 0) });
        page.drawText(`Designation: ${designation}`, { x: 50, y: height - 13 * fontSize, size: fontSize, color: rgb(0, 0, 0) });
        page.drawText(`Place of Work: ${placeOfWork}`, { x: 50, y: height - 14 * fontSize, size: fontSize, color: rgb(0, 0, 0) });

        const pdfBytes = await pdfDoc.save();

        // Convert Uint8Array to Buffer
        const pdfBuffer = Buffer.from(pdfBytes);

        // Save to MongoDB
        const user = new User({
            name,
            email,
            phone: { value: phone, isVerified: false },
            address,
            age,
            department,
            designation,
            placeOfWork,
            pdf: pdfBuffer
        });
        await user.save();

        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=user_details.pdf',
            }
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error saving user data' }, { status: 500 });
    }
}
