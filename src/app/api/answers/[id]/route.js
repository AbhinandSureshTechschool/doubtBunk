import Answer from "@/app/models/Answer";
import Doubt from "@/app/models/Doubt";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const { text, videoUrl } = await req.json();
        const updated = await Answer.findByIdAndUpdate(id, { text, videoUrl });
        if (!updated) {
            return NextResponse.json(
                { message: "Answer not found" },
                { status: 404 }
            )
        }
        return NextResponse.json(
            { message: "updated answer successful" },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        )
    }
};

export async function DELETE(req, { params }) {
    try {
        const { id } = await params;
        await Answer.findByIdAndDelete(id);
        return NextResponse.json(
            { message: "Answer deleted successful" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        )
    }
};

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const doubt = await Doubt.find({ _id: id })
        const answers = await Answer.find({ doubt: id });
        return NextResponse.json(
            { message: "Answers get successful", answers, doubt },
            { status: 200 }
        );
        
    } catch (error) {
         return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        ); 
    }
};