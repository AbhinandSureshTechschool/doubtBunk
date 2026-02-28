// Register 
import bcrypt from "bcryptjs";
import connectDB from "@/app/lib/db";
import { registerSchema } from "@/app/lib/validators";
import User from "@/app/models/User";
import { NextResponse } from "next/server";
import metrics from "@/app/lib/metrics";

export async function POST(req) {
  const end = metrics.httpRequestDuration.startTimer();
  try {
    metrics.registerCounter.inc();
    const body = await req.json();

    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      metrics.httpRequestCounter.inc({
        method: "POST",
        route: "/api/register",
        status: 400,
      })
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        {
          success: false,
          message: firstError.message,
          field: firstError.path[0],
        },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;


    await connectDB();

    const userExist = await User.findOne({ email });

    if (userExist) {
      metrics.httpRequestCounter.inc({
        method: "POST",
        route: "/api/register",
        status: 400,
      });
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword
    });

    metrics.httpRequestCounter.inc({
      method: "POST",
      route: "/api/register",
      status: 200
    });

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });

  } catch (error) {
    metrics.errorCounter.inc();

    metrics.httpRequestCounter.inc({
      method: "POST",
      route: "/api/register",
      status: 500,
    });
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  } finally {
    end({ method: "POST", route: "/api/register" });
  }
}