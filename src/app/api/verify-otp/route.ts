import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const otpFilePath = path.resolve('./otps.json');

export async function POST(req: NextRequest) {
    try {
        const { email, code } = await req.json();
        const emailLower = email.trim().toLowerCase();
        console.log(emailLower);

        if (!code) {
            return NextResponse.json({ message: 'Code is required' }, { status: 400 });
        }

        let otps = JSON.parse(fs.readFileSync(otpFilePath, 'utf-8'));
        const storedOtp = otps[emailLower];
        console.log('Retrieved OTP:', storedOtp);
        console.log("code " , code)

        if (storedOtp == code) {
            console.log("verify toh ho rha ")
            delete otps[emailLower];  // Remove the OTP after verification
            fs.writeFileSync(otpFilePath, JSON.stringify(otps));
            return NextResponse.json({ message: 'OTP verified successfully' });
        } else {
            console.log("verify toh nhi ho rha ")
            return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
        }
    } catch (err) {
        console.error("Error during OTP verification:", err);
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
    }
}
