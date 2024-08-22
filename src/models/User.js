// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: {
        value: { type: String, required: true, unique: true },
        isVerified: { type: Boolean, default: false },
    },
    address: { type: String, required: true },
    age: { type: String, required: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    placeOfWork: { type: String, required: true },
    code: { type: Number },
    pdf: Buffer,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },  // Default role is 'user'
});

// Check if admin based on email
UserSchema.pre('save', function (next) {
    if (this.email === 'dd@gmail.com') {
        this.role = 'admin';
    }
    next();
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
