import connectDB from "@/app/lib/db";
import Doubt from "@/app/models/Doubt";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


export async function PUT(req, { params }) {
    try {
       const { title, description } = await req.json();
       const { id } = await params ;
       
       
       await connectDB();
       const updated = await Doubt.findByIdAndUpdate(id , { title, description }, { new: true });
       if(!updated) {
        return NextResponse.json(
            { message: "Doubt not found" },
            { status: 404 }
        )
       }
       return NextResponse.json(
        { message: "Doubt updated successful" },
        { status: 200 }
       )
    } catch (error) {
        console.log('error on updating doubts', error)
    }
}

export async function DELETE(req, { params }) {
    try {
      const { id } = await params;
      const doubtData = await Doubt.findById(id);
      if(!doubtData) {
        return NextResponse.json(
            { message: "Doubt not found" },
            { status: 404 }
        )
      };
      await Doubt.findByIdAndDelete(id);
      return NextResponse.json(
        { message: "Doubt deleted successful" },
        { status: 200 }
      );
    } catch (error) {
      console.log('error on deleting doubt', error)  
    }
}

export async function GET(req, { params }) {
    try {
      const { id } = await params;
      const doubts = await Doubt.find({ user: id });
      return NextResponse.json(
        { message: "Doubts (users) get successful", doubts },
        { status: 200 },
      )
    } catch (error) {
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}