// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        value: {
            type: String,
            required: true,
            unique: true
        },
        isVerified: {
            type: boolean,
            default: false,
        }
    },
    address: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    placeOfWork: {
        type: String,
        required: true
    },
    code: {
        type: Number,
        required: true
    },
    pdf: Buffer,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
