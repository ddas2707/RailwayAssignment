import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const otpFilePath = path.resolve('./otps.json');

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();
        const emailLower = email.trim().toLowerCase(); // Normalize email

        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        console.log(`Storing OTP ${otp} for email: ${emailLower}`);

        let otps = JSON.parse(fs.readFileSync(otpFilePath, 'utf-8'));
        otps[emailLower] = otp;
        fs.writeFileSync(otpFilePath, JSON.stringify(otps));

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
