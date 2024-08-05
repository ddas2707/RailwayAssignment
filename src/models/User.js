// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    address: String,
    age: Number,
    pdf: Buffer,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
