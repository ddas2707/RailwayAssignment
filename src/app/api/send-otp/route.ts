import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

let otps = new Map<string, string>();

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();
        const emailLower = email.trim().toLowerCase(); // Normalize email

        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        console.log(`Storing OTP ${otp} for email: ${emailLower}`);

        otps.set(emailLower, otp);
        console.log(otps);

        console.log(`Current OTPs stored: ${JSON.stringify([...otps.entries()])}`);

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_PORT === '465',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: emailLower,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}`,
        });

        return NextResponse.json({ message: 'OTP sent successfully' });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
    }
}




// import { NextRequest, NextResponse } from 'next/server';
// import nodemailer from 'nodemailer';

// let otps = new Map<string, string>();

// export async function POST(req: NextRequest) {
//     try {
//         const { email } = await req.json();

//         // Generate a 4-digit OTP
//         const otp = Math.floor(1000 + Math.random() * 9000).toString();

//         // Store the OTP against the email
//         otps.set(email, otp);

//         // Set up email transporter
//         const transporter = nodemailer.createTransport({
//             host: process.env.SMTP_HOST, // Your SMTP server host
//             port: Number(process.env.SMTP_PORT), // Your SMTP server port
//             secure: process.env.SMTP_PORT === '465', // true for port 465, false for port 587
//             auth: {
//                 user: process.env.SMTP_USER, // Your SMTP username
//                 pass: process.env.SMTP_PASSWORD, // Your SMTP password
//             },
//         });

//         // Send the OTP to the user's email
//         await transporter.sendMail({
//             from: process.env.SMTP_USER, // Your SMTP username
//             to: email,
//             subject: 'Your OTP Code',
//             text: `Your OTP code is ${otp}`,
//         });

//         return NextResponse.json({ message: 'OTP sent successfully' });
//     } catch (err) {
//         console.error(err);
//         return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
//     }
// }
