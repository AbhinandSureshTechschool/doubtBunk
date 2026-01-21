import connectDB from "@/app/lib/db";
import Answer from "@/app/models/Answer";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


export async function POST(req) {
    try {
        const { text, videoUrl, doubtId, userId } = await req.json();
        
        const doubtsId = new mongoose.Types.ObjectId(doubtId);
        const usersId = new mongoose.Types.ObjectId(userId);

       if(!text, !doubtId) {
        return NextResponse.json(
            { message: "Text and doubtId are required" },
            { status: 400 }
        )
       }
       await connectDB();

       const answer = await Answer.create({
        text,
        doubt: doubtId,
        videoUrl: videoUrl,
        user: userId 
       });

       return NextResponse.json({ message: "Solution added successful", answer}, { status: 201 });
       
    } catch (error) {
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        )
    }
}