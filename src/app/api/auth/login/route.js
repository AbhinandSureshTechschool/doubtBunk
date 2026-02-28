import { signToken } from "@/app/lib/auth";
import connectDB from "@/app/lib/db";
import User from "@/app/models/User";
import bcrypt from 'bcryptjs'
import { NextResponse } from "next/server";
import { loginSchema } from "@/app/lib/validators";
import metrics from "@/app/lib/metrics";

export async function POST(req) {
    const end = metrics.httpRequestDuration.startTimer();
    try {
        metrics.loginCounter.inc();
        const { email, password } = await req.json();

        if (!email || !password) {
            metrics.httpRequestCounter.inc({
                method: "POST",
                route: "/api/login",
                status: 400,
            })
            return NextResponse.json(
                { message: "Email and Password required" },
                { status: 400 }
            )
        }

        const parsed = loginSchema.safeParse({ email, password });

        if (!parsed.success) {
            metrics.httpRequestCounter.inc({
                method: "POST",
                route: "/api/login",
                status: 400,
            });

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
            metrics.httpRequestCounter.inc({
                method: "POST",
                route: "/api/login",
                status: 401
            });

            return NextResponse.json(
                { success: false, message: "Invalid credentials" },
                { status: 401 }
            )
        };

        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            metrics.httpRequestCounter.inc({
                method: "POST",
                route: "/api/login",
                status: 401,
            });

            return NextResponse.json(
                { success: false, message: 'Invalid credentials' },
                { status: 401 }
            )
        };


        const token = signToken({
            userId: user._id,
            email: user.email
        });

       metrics.httpRequestCounter.inc({
          method: "POST",
          route: "/api/login",
          status: 200
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
        metrics.errorCounter.inc();

        metrics.httpRequestCounter.inc({
            method: "POST",
            route: "/api/login",
            status: 500,
        });

        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        )
    } finally {
        end({ method: "POST", route: "/api/login" });
    }
}