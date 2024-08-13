import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
    try {
        let otps = new Map<string, string>();

        const { email, code } = await req.json();
        const emailLower = email.trim().toLowerCase(); 
        console.log(emailLower);

        if (!code) {
            return NextResponse.json({ message: 'Code is required' }, { status: 400 });
        }

        const storedOtp = otps.get(emailLower);
        console.log('Retrieved OTP:', storedOtp);
        if (storedOtp == code) {
            otps.delete(emailLower);  // Remove the OTP after verification
            return NextResponse.json({ message: 'OTP verified successfully' });
        } else {
            return NextResponse.json({ message: 'Invalid OT2P' }, { status: 400 });
        }
    } catch (err) {
        console.error("Error during OTP verification:", err);
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
    }
}
