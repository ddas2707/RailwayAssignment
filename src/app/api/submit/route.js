import { NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import { Readable } from 'stream';

export async function POST(request) {
    try {
        // Parse the form data
        const data = await request.formData();

        // Extracting form fields
        const name = data.get('name');
        const email = data.get('email');
        const phone = data.get('phone');
        const address = data.get('address');
        const age = data.get('age');
        const department = data.get('department');
        const designation = data.get('designation');
        const placeOfWork = data.get('placeOfWork');
        const image = data.get('image'); // This is a File object

        if (!image) {
            throw new Error('Image not provided');
        }

        // Convert the image to a buffer
        const imageBuffer = Buffer.from(await image.arrayBuffer());

        // Create a PDF document
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 400]); // Page size [width, height]

        // Add text content to PDF
        page.drawText(`Name: ${name}`, { x: 50, y: 350, size: 12 });
        page.drawText(`Email: ${email}`, { x: 50, y: 330, size: 12 });
        page.drawText(`Phone: ${phone}`, { x: 50, y: 310, size: 12 });
        page.drawText(`Address: ${address}`, { x: 50, y: 290, size: 12 });
        page.drawText(`Age: ${age}`, { x: 50, y: 270, size: 12 });
        page.drawText(`Department: ${department}`, { x: 50, y: 250, size: 12 });
        page.drawText(`Designation: ${designation}`, { x: 50, y: 230, size: 12 });
        page.drawText(`Place of Work: ${placeOfWork}`, { x: 50, y: 210, size: 12 });

        // Handle image based on its format
        let img;
        try {
            img = await pdfDoc.embedPng(imageBuffer);
        } catch (err) {
            try {
                img = await pdfDoc.embedJpg(imageBuffer);
            } catch (err) {
                throw new Error('The input is not a PNG or JPG file!');
            }
        }

        // Add image to PDF on the right side
        const { width, height } = img.scale(0.5); // Scale the image as needed
        page.drawImage(img, {
            x: 400, // X coordinate for image (right side)
            y: 150, // Y coordinate for image
            width: width,
            height: height,
        });

        // Serialize the PDF document
        const pdfBytes = await pdfDoc.save();
        const pdfStream = new Readable();
        pdfStream.push(pdfBytes);
        pdfStream.push(null);

        // Return the PDF file as a response
        return new NextResponse(pdfStream, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=user_details.pdf`,
            },
        });

    } catch (error) {
        console.error(error); // Log the error for debugging
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}



// import { NextResponse } from 'next/server';
// import { PDFDocument } from 'pdf-lib';
// import { Readable } from 'stream';

// export async function POST(request) {
//     try {
//         // Parse the form data
//         const data = await request.formData();

//         // Extracting form fields
//         const name = data.get('name');
//         const email = data.get('email');
//         const phone = data.get('phone');
//         const address = data.get('address');
//         const age = data.get('age');
//         const department = data.get('department');
//         const designation = data.get('designation');
//         const placeOfWork = data.get('placeOfWork');
//         const image = data.get('image'); // This is a File object

//         if (!image) {
//             throw new Error('Image not provided');
//         }

//         // Convert the image to a buffer
//         const imageBuffer = Buffer.from(await image.arrayBuffer());

//         // Create a PDF document
//         const pdfDoc = await PDFDocument.create();
//         const page = pdfDoc.addPage();

//         // Add text content to PDF
//         page.drawText(`Name: ${name}`, { y: 700 });
//         page.drawText(`Email: ${email}`, { y: 670 });
//         page.drawText(`Phone: ${phone}`, { y: 640 });
//         page.drawText(`Address: ${address}`, { y: 610 });
//         page.drawText(`Age: ${age}`, { y: 580 });
//         page.drawText(`Department: ${department}`, { y: 550 });
//         page.drawText(`Designation: ${designation}`, { y: 520 });
//         page.drawText(`Place of Work: ${placeOfWork}`, { y: 490 });

//         // Handle image based on its format
//         let img;
//         try {
//             img = await pdfDoc.embedPng(imageBuffer);
//         } catch (err) {
//             try {
//                 img = await pdfDoc.embedJpg(imageBuffer);
//             } catch (err) {
//                 throw new Error('The input is not a PNG or JPG file!');
//             }
//         }

//         // Add image to PDF
//         page.drawImage(img, {
//             x: 50,
//             y: 50,
//             width: 500,
//             height: 400,
//         });

//         // Serialize the PDF document
//         const pdfBytes = await pdfDoc.save();
//         const pdfStream = new Readable();
//         pdfStream.push(pdfBytes);
//         pdfStream.push(null);

//         // Return the PDF file as a response
//         return new NextResponse(pdfStream, {
//             headers: {
//                 'Content-Type': 'application/pdf',
//                 'Content-Disposition': `attachment; filename=user_details.pdf`,
//             },
//         });

//     } catch (error) {
//         console.error(error); // Log the error for debugging
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// }
