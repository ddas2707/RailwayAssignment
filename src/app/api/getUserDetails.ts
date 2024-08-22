// src/app/api/getUserDetails.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import User from '../../models/User'; // Assuming this is your User model

const getUserDetails = async (req: NextApiRequest, res: NextApiResponse) => {
  // Connect to MongoDB (if not connected already)
  const uri: string = process.env.MONGODB_URI as string;
  await mongoose.connect(uri);
  
  try {
    // Example: Fetching all users (you might want to filter by specific criteria)
    const users = await User.find({}, { _id: 0, name: 1, email: 1, phone: 1, address: 1, age: 1, department: 1, designation: 1, placeOfWork: 1, code: 1 });

    if (!users) {
      return res.status(404).json({ message: 'Users not found' });
    }

    res.status(200).json(users);
  } catch (error:any) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export default getUserDetails;
