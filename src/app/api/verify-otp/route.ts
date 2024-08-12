import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_ID;

const client = twilio(accountSid, authToken);

export async function POST(req: NextRequest) {
    try {
        const { phone, code } = await req.json(); // Extract phone number and OTP from request

        if (!serviceId) {
            return NextResponse.json({ message: 'Twilio Service ID is not configured' }, { status: 500 });
        }
        if (!code) {
            return NextResponse.json({ message: 'Code is required' }, { status: 400 });
        }

        console.log("Verifying OTP for service ID:", serviceId);
        console.log("Phone number:", phone);
        console.log("OTP code:", code);

        const verificationCheck = await client.verify.v2.services(serviceId).verificationChecks.create({
            to: phone,
            code: code,
        });

        console.log("Twilio Verification Response:", verificationCheck);

        if (verificationCheck.status === 'approved') {
            return NextResponse.json({ message: 'OTP verified successfully' });
        } else {
            return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
        }
    } catch (err) {
        console.error("Error during OTP verification:", err);
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
    }
}
