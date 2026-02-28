import connectDB from "@/app/lib/db";
import Doubt from "@/app/models/Doubt";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import metrics from "@/app/lib/metrics";


export async function POST(req) {
    const end = metrics.httpRequestDuration.startTimer();
    try {
        metrics.doubtCounter.inc();

        const { title, description, user } = await req.json();
        await connectDB();
        const userObj = new mongoose.Types.ObjectId(user);
        await Doubt.create({ title, description, user: userObj });

        metrics.httpRequestCounter.inc({
            method: "POST",
            route: "/api/doubts",
            status: 200
        });

        return NextResponse.json(
            { message: "Doubt added successful" },
            { status: 201 }
        )
    } catch (error) {
        metrics.httpRequestCounter.inc({
            method: "POST",
            route: "/api/doubts",
            status: 500
        });
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    } finally {
        end({ method: "POST", route: "/api/doubts" })
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


