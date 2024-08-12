import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_ID;

const client = twilio(accountSid, authToken);

export async function POST(req:NextRequest) {
    try {
        const { phone } = await req.json(); // Extract phone number from request

        // Validate and format phone number
        const phoneNumber = parsePhoneNumberFromString(phone);
        if (!phoneNumber || !phoneNumber.isValid()) {
            return NextResponse.json({ message: 'Invalid phone number' }, { status: 400 });
        }

        const formattedPhoneNumber = phoneNumber.format('E.164');

        if (!serviceId) {
            return NextResponse.json({ message: 'Twilio Service ID is not configured' }, { status: 500 });
        }
        console.log("Verifying OTP for service ID:", serviceId);

        const twilioResponse = await client.verify.v2.services(serviceId).verifications.create({
            to: formattedPhoneNumber,
            channel: 'sms'
        });

        return NextResponse.json({ message: 'OTP sent successfully' });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
    }
}
