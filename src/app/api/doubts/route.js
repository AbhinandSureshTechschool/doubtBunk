import connectDB from "@/app/lib/db";
import Doubt from "@/app/models/Doubt";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


export async function POST(req) {
    try {
        const { title, description, user } = await req.json();
        await connectDB();
        const userObj = new mongoose.Types.ObjectId(user);
        await Doubt.create({ title, description, user: userObj });
        return NextResponse.json(
            { message: "Doubt added successful" },
            { status: 201 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
};

export async function GET() {
    try {
        await connectDB();
        const doubts = await Doubt.find().sort({ createdAt: -1 });

        return NextResponse.json({ message: "Doubts get successful", doubts }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch doubts" },
            { status: 500 }
        );
    }
}


