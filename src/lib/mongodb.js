import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            // No need for useNewUrlParser and useUnifiedTopology in Mongoose 6+
        }).then((mongoose) => {
            console.log("Mongodb successfully connected");
            return mongoose;
        }).catch((error) => {
            console.error("Mongodb connection error:", error);
            throw new Error('Failed to connect to MongoDB');
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default connectToDatabase;
