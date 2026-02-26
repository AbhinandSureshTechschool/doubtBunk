import { signToken } from "@/app/lib/auth";
import connectDB from "@/app/lib/db";
import User from "@/app/models/User";
import bcrypt from 'bcryptjs'
import { NextResponse } from "next/server";
import { loginSchema } from "@/app/lib/validators";

export async function POST(req) {
    try {
        metrics.loginCounter.inc();
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and Password required" },
                { status: 400 }
            )
        }

        const parsed = loginSchema.safeParse({ email, password });

        if (!parsed.success) {
            const firstError = parsed.error.issues[0];
            return NextResponse.json(
                {
                    success: false,
                    message: firstError.message,
                    field: firstError.path[0],
                },
                { status: 400 }
            );
        };

        await connectDB();

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Invalid credentials" },
                { status: 401 }
            )
        };

        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return NextResponse.json(
                { success: false, message: 'Invalid credentials' },
                { status: 401 }
            )
        };


        const token = signToken({
            userId: user._id,
            email: user.email
        });

       

        const response = NextResponse.json(
            {
                message: "login successful",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            }
        );

        response.cookies.set("token", token, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;

    } catch (error) {
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        )
    }
}