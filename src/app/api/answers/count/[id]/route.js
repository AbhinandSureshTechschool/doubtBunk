import connectDB from "@/app/lib/db";
import Answer from "@/app/models/Answer";
import { NextResponse } from "next/server";


export async function GET(req, { params }) {
    try {
        const { id } = await params;
        await connectDB()
        const count = await Answer.countDocuments({ doubt: id });
        return NextResponse.json(
            { message: "Count get successful", count },
            { status: 201 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        )
    }
}