import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectToDB } from "@/lib/mongodb";
import { generateToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const { id, password } = await req.json();

    if (!id || !password) {
      return NextResponse.json(
        { success: false, message: "ID and password required" },
        { status: 400 },
      );
    }

    // --- NORMALIZATION LOGIC ---
    // This ensures the input matches the uppercase data stored in your DB
    const normalizedId = id.trim().toUpperCase();

    // Use $or to check all possible ID fields in a single database query
    const user = await User.findOne({
      $or: [
        { rollNumber: normalizedId },
        { staffId: normalizedId },
        { adminId: normalizedId },
      ],
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 },
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Incorrect password" },
        { status: 400 },
      );
    }

    const token = generateToken({
      id: user._id,
      role: user.role,
    });

    const res = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
      },
    });

    // 🔐 STORE TOKEN
    res.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 },
    );
  }
}
