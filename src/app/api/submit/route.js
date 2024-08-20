import { NextResponse } from 'next/server';
import { PDFDocument, rgb } from 'pdf-lib';
import { Readable } from 'stream';
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

export async function POST(request) {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);

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
        const signature = data.get('signature'); // This is a File object

        if (!image || !signature) {
            throw new Error('Image or signature not provided');
        }

        // Convert the image and signature to buffers
        const imageBuffer = Buffer.from(await image.arrayBuffer());
        const signatureBuffer = Buffer.from(await signature.arrayBuffer());

        // Create a PDF document
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 800]); // Increase page height

        // Define table dimensions
        const tableTop = 700; // Adjust top position
        const rowHeight = 30; // Increase row height
        const columnWidth = 180;
        const tableWidth = columnWidth * 3; // 3 columns
        const tableHeight = rowHeight * 8; // 8 rows

        // Draw table lines
        page.drawRectangle({
            x: 50,
            y: tableTop - tableHeight,
            width: tableWidth,
            height: tableHeight,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        // Draw column lines for the first two columns
        for (let i = 1; i < 2; i++) { // 2 columns (excluding the last one)
            page.drawLine({
                start: { x: 50 + i * columnWidth, y: tableTop },
                end: { x: 50 + i * columnWidth, y: tableTop - tableHeight },
                color: rgb(0, 0, 0),
                thickness: 1,
            });
        }

        // Draw rows lines for the first two columns only
        for (let i = 0; i <= 8; i++) { // 8 rows including header
            const y = tableTop - i * rowHeight;
            if (i < 8) { // Skip the last row line in the last column
                page.drawLine({
                    start: { x: 50, y },
                    end: { x: 50 + columnWidth * 2, y }, // Draw only for the first two columns
                    color: rgb(0, 0, 0),
                    thickness: 1,
                });
            }
            // Draw line for the third column's bottom of the row
            if (i === 7) { // Add line only at the bottom of the last row
                page.drawLine({
                    start: { x: 50 + 2 * columnWidth, y },
                    end: { x: 50 + 2 * columnWidth, y: tableTop - tableHeight },
                    color: rgb(0, 0, 0),
                    thickness: 1,
                });
            }
        }

        // Draw data rows
        const rows = [
            ['Name', name],
            ['Email', email],
            ['Phone', phone],
            ['Address', address],
            ['Age', age],
            ['Department', department],
            ['Designation', designation],
            ['Place of Work', placeOfWork]
        ];

        rows.forEach((row, i) => {
            page.drawText(row[0], { x: 50 + 5, y: tableTop - (i + 1) * rowHeight + 5, size: 12, color: rgb(0, 0, 0) });
            page.drawText(row[1], { x: 50 + columnWidth + 5, y: tableTop - (i + 1) * rowHeight + 5, size: 12, color: rgb(0, 0, 0) });
        });

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

        // Handle signature image
        let signatureImg;
        try {
            signatureImg = await pdfDoc.embedPng(signatureBuffer);
        } catch (err) {
            try {
                signatureImg = await pdfDoc.embedJpg(signatureBuffer);
            } catch (err) {
                throw new Error('The signature input is not a PNG or JPG file!');
            }
        }

        // Draw the images in the third column
        const imageScale = 0.65; // Scale images to fit in the table cells
        const signatureScale = 0.4 // scale signature image to fit in the table cells
        const imgSize = img.scale(imageScale);
        const signatureImgSize = signatureImg.scale(signatureScale);

        // Draw the main image
        page.drawImage(img, {
            x: 50 + 2 * columnWidth + 10,
            y: tableTop - 50 - 2 * rowHeight + (rowHeight - imgSize.height) / 2, // Adjust y to fit in the cell
            width: imgSize.width,
            height: imgSize.height,
        });

        // Draw the signature image
        // Draw the signature image with adjusted y-coordinate
        page.drawImage(signatureImg, {
            x: 50 + 2 * columnWidth + 10,
            y: tableTop - rowHeight - 180 + (rowHeight - signatureImgSize.height) / 2, // Adjust y further down
            width: signatureImgSize.width,
            height: signatureImgSize.height,
        });


        // Serialize the PDF document
        const pdfBytes = await pdfDoc.save();

        // Convert the PDF bytes to a Buffer
        const pdfBuffer = Buffer.from(pdfBytes);

        // Save PDF to database
        const pdfDocument = new PdfModel({
            name,
            email,
            phone,
            address,
            age,
            department,
            designation,
            placeOfWork,
            pdf: pdfBuffer, // Store the PDF buffer in the database
        });

        await pdfDocument.save();
        // Return the PDF file as a response
        const pdfStream = new Readable();
        pdfStream.push(pdfBytes);
        pdfStream.push(null);

        return new NextResponse(pdfStream, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=user_details.pdf`,
            },
        });

    } catch (error) {
        console.error(error); // Log the error for debugging
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        // Ensure that Mongoose connection is closed properly
        await mongoose.disconnect();
    }
}


// import { NextResponse } from 'next/server';
// import { PDFDocument, rgb } from 'pdf-lib';
// import { Readable } from 'stream';
// import mongoose from 'mongoose';

// // Check if the model already exists before defining it
// const PdfModel = mongoose.models.Pdf || mongoose.model('Pdf', new mongoose.Schema({
//     name: String,
//     email: String,
//     phone: String,
//     address: String,
//     age: String,
//     department: String,
//     designation: String,
//     placeOfWork: String,
//     pdf: Buffer, // Store the PDF as binary data
// }));

// export async function POST(request) {
//     try {
//         // Connect to MongoDB
//         await mongoose.connect(process.env.MONGODB_URI);

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
//         const signature = data.get('signature'); // This is a File object

//         if (!image || !signature) {
//             throw new Error('Image or signature not provided');
//         }

//         // Convert the image and signature to buffers
//         const imageBuffer = Buffer.from(await image.arrayBuffer());
//         const signatureBuffer = Buffer.from(await signature.arrayBuffer());

//         // Create a PDF document
//         const pdfDoc = await PDFDocument.create();
//         const page = pdfDoc.addPage([600, 500]); // Page size [width, height]

//         // Define table dimensions
//         const tableTop = 400;
//         const rowHeight = 20;
//         const columnWidth = 180;
//         const tableWidth = columnWidth * 3; // 3 columns
//         const tableHeight = rowHeight * 8; // 8 rows

//         // Draw table lines
//         page.drawRectangle({
//             x: 50,
//             y: tableTop - tableHeight,
//             width: tableWidth,
//             height: tableHeight,
//             borderColor: rgb(0, 0, 0),
//             borderWidth: 1,
//         });

//         // Draw column lines for the first two columns
//         for (let i = 1; i < 2; i++) { // 2 columns (excluding the last one)
//             page.drawLine({
//                 start: { x: 50 + i * columnWidth, y: tableTop },
//                 end: { x: 50 + i * columnWidth, y: tableTop - tableHeight },
//                 color: rgb(0, 0, 0),
//                 thickness: 1,
//             });
//         }

//         // Draw rows lines for the first two columns only
//         for (let i = 0; i <= 8; i++) { // 8 rows including header
//             const y = tableTop - i * rowHeight;
//             if (i < 8) { // Skip the last row line in the last column
//                 page.drawLine({
//                     start: { x: 50, y },
//                     end: { x: 50 + columnWidth * 2, y }, // Draw only for the first two columns
//                     color: rgb(0, 0, 0),
//                     thickness: 1,
//                 });
//             }
//             // Draw line for the third column's bottom of the row
//             if (i === 7) { // Add line only at the bottom of the last row
//                 page.drawLine({
//                     start: { x: 50 + 2 * columnWidth, y },
//                     end: { x: 50 + 2 * columnWidth, y: tableTop - tableHeight },
//                     color: rgb(0, 0, 0),
//                     thickness: 1,
//                 });
//             }
//         }

//         // Draw table headers
//         const headers = ['Field', 'Value', 'Image'];
//         headers.forEach((header, i) => {
//             page.drawText(header, { x: 50 + i * columnWidth + 5, y: tableTop + 5, size: 12, color: rgb(0, 0, 0) });
//         });

//         // Draw data rows
//         const rows = [
//             ['Name', name],
//             ['Email', email],
//             ['Phone', phone],
//             ['Address', address],
//             ['Age', age],
//             ['Department', department],
//             ['Designation', designation],
//             ['Place of Work', placeOfWork]
//         ];

//         rows.forEach((row, i) => {
//             page.drawText(row[0], { x: 50 + 5, y: tableTop - (i + 1) * rowHeight + 5, size: 12, color: rgb(0, 0, 0) });
//             page.drawText(row[1], { x: 50 + columnWidth + 5, y: tableTop - (i + 1) * rowHeight + 5, size: 12, color: rgb(0, 0, 0) });
//         });

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

//         // Handle signature image
//         let signatureImg;
//         try {
//             signatureImg = await pdfDoc.embedPng(signatureBuffer);
//         } catch (err) {
//             try {
//                 signatureImg = await pdfDoc.embedJpg(signatureBuffer);
//             } catch (err) {
//                 throw new Error('The signature input is not a PNG or JPG file!');
//             }
//         }

//         // Draw the images in the third column
//         const imageScale = 0.4; // Scale images to fit in the table cells
//         const imgSize = img.scale(imageScale);
//         const signatureImgSize = signatureImg.scale(imageScale);

//         // Draw the main image
//         page.drawImage(img, {
//             x: 60 + 2 * columnWidth + 10,
//             y: tableTop - 2 * rowHeight + (rowHeight - imgSize.height) / 2, // Adjust y to fit in the cell
//             width: imgSize.width,
//             height: imgSize.height,
//         });

//         // Draw the signature image
//         page.drawImage(signatureImg, {
//             x: 60 + 2 * columnWidth + 10,
//             y: tableTop - rowHeight + (rowHeight - signatureImgSize.height) / 2, // Adjust y to fit in the cell
//             width: signatureImgSize.width,
//             height: signatureImgSize.height,
//         });

//         // Serialize the PDF document
//         const pdfBytes = await pdfDoc.save();

//         // Convert the PDF bytes to a Buffer
//         const pdfBuffer = Buffer.from(pdfBytes);

//         // Save PDF to database
//         const pdfDocument = new PdfModel({
//             name,
//             email,
//             phone,
//             address,
//             age,
//             department,
//             designation,
//             placeOfWork,
//             pdf: pdfBuffer, // Store the PDF buffer in the database
//         });

//         await pdfDocument.save();
//         // Return the PDF file as a response
//         const pdfStream = new Readable();
//         pdfStream.push(pdfBytes);
//         pdfStream.push(null);

//         return new NextResponse(pdfStream, {
//             headers: {
//                 'Content-Type': 'application/pdf',
//                 'Content-Disposition': `attachment; filename=user_details.pdf`,
//             },
//         });

//     } catch (error) {
//         console.error(error); // Log the error for debugging
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     } finally {
//         // Ensure that Mongoose connection is closed properly
//         await mongoose.disconnect();
//     }
// }





