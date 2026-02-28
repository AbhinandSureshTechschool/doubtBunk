import connectDB from "@/app/lib/db";
import Answer from "@/app/models/Answer";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import metrics from "@/app/lib/metrics";


export async function POST(req) {
    const end = metrics.httpRequestDuration.startTimer();
    try {
        metrics.answerCounter.inc();

        const { text, videoUrl, doubtId, userId } = await req.json();

        const doubtsId = new mongoose.Types.ObjectId(doubtId);
        const usersId = new mongoose.Types.ObjectId(userId);

        if (!text, !doubtId) {
            metrics.httpRequestCounter.inc({
                method: "POST",
                route: "/api/answers",
                status: 400
            });
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

        metrics.httpRequestCounter.inc({
            method: "POST",
            route: "/api/answers",
            status: 200
        });

        return NextResponse.json({ message: "Solution added successful", answer }, { status: 201 });

    } catch (error) {
        metrics.httpRequestCounter.inc({
            method: "POST",
            route: "/api/answers",
            status: 500
        });
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        )
    } finally {
        end({ method: "POST", route: "/api/answers" })
    }
}