import Answer from "@/app/models/Answer";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


export async function GET(req, { params }) {
    try {
        const { id } = await params;
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