import cloudinary from "@/app/lib/cloudinary";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');
        
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { resource_type: "video", folder: process.env.CLOUD_VIDEO_FOLDER },
                (err, result) => {
                    if(err) reject(err);
                    resolve(result);
                }
            ).end(buffer);
        })
        
        return NextResponse.json(
            { url: result.secure_url }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Upload failed" },
            { status: 500 }
        )
    }
}