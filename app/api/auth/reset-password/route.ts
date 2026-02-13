import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectToDB } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const { token, password } = await req.json();

    // 1. Hash the token from the URL to match the one in the DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // 2. Find user with valid token and check if it hasn't expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Token is invalid or has expired" },
        { status: 400 },
      );
    }

    // 3. Hash new password and clear the reset fields
    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err: any) {
    console.error("Reset Error:", err.message);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
