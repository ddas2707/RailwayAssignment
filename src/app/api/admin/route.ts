// src/app/api/admin/route.ts
import { NextResponse } from 'next/server';
import User from '@/models/User'; // Adjust import path as per your project structure
import connectToDatabase from '@/lib/mongodb'; // Adjust import path as per your project structure

export async function GET(req: Request) {
    try {
        await connectToDatabase(); // Ensure the database is connected

        // Implement your admin authentication logic here
        const isAdmin = true; // Replace with your actual admin check logic

        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const users = await User.find({});
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}
