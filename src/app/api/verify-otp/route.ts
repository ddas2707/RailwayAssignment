import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import OtpModel from '../path-to-otp/otp'

export async function POST(req: NextRequest) {
    try {
        // Connect to MongoDB
        await connectToDatabase();

        const { email, code } = await req.json();
        const emailLower = email.trim().toLowerCase();
        console.log(emailLower);

        if (!code) {
            return NextResponse.json({ message: 'Code is required' }, { status: 400 });
        }

        // Retrieve the OTP from the database
        const otpEntry = await OtpModel.findOne({ email: emailLower });
        
        if (!otpEntry) {
            return NextResponse.json({ message: 'OTP not found' }, { status: 400 });
        }

        const storedOtp = otpEntry.otp;
        console.log('Retrieved OTP:', storedOtp);
        console.log("code ", code);

        if (storedOtp == code) {
            console.log("OTP verified successfully");

            // Delete the OTP after successful verification
            await OtpModel.deleteOne({ email: emailLower });

            return NextResponse.json({ message: 'OTP verified successfully' });
        } else {
            console.log("Invalid OTP");
            return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
        }
    } catch (err) {
        console.error("Error during OTP verification:", err);
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
    }
}


// import { NextRequest, NextResponse } from 'next/server';
// import fs from 'fs';
// import path from 'path';

// const otpFilePath = path.resolve('./otps.json');

// export async function POST(req: NextRequest) {
//     try {
//         const { email, code } = await req.json();
//         const emailLower = email.trim().toLowerCase();
//         console.log(emailLower);

//         if (!code) {
//             return NextResponse.json({ message: 'Code is required' }, { status: 400 });
//         }

//         let otps = JSON.parse(fs.readFileSync(otpFilePath, 'utf-8'));
//         const storedOtp = otps[emailLower];
//         console.log('Retrieved OTP:', storedOtp);
//         console.log("code " , code)

//         if (storedOtp == code) {
//             console.log("verify toh ho rha ")
//             delete otps[emailLower];  // Remove the OTP after verification
//             fs.writeFileSync(otpFilePath, JSON.stringify(otps));
//             return NextResponse.json({ message: 'OTP verified successfully' });
//         } else {
//             console.log("verify toh nhi ho rha ")
//             return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
//         }
//     } catch (err) {
//         console.error("Error during OTP verification:", err);
//         return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
//     }
// }
