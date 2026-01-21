// Register 
import bcrypt from "bcryptjs";
import connectDB from "@/app/lib/db";
import { registerSchema } from "@/app/lib/validators";
import User from "@/app/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const parsed = registerSchema.safeParse(body);

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
    }

    const { name, email, password } = parsed.data;


    await connectDB();

    const userExist = await User.findOne({ email });

    if (userExist) {
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

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}