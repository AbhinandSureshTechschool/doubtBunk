import mongoose from "mongoose";


const MONOGDB_URL = process.env.MONGODB_URL;

if(!MONOGDB_URL) {
    throw new Error("Please defind mongodb url in .env.local")
};

let cached = global.mongoose;

if(!cached) {
    cached = global.mongoose = { conn: null, promise: null }
};

async function connectDB() {
    if(cached.conn) return cached.conn;

    if(!cached.promise) {
        cached.promise = await mongoose.connect(MONOGDB_URL, {
            bufferCommands: false
        })
    }

    cached.conn = await cached.conn;
    return cached.conn;
};

export default connectDB;



