import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectToDB } from "@/lib/mongodb";
import { generateToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });

    const token = generateToken({
      id: user._id,
      role: user.role,
      rollNumber: user.rollNumber,
      staffId: user.staffId,
      adminId: user.adminId,
    });

    return NextResponse.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
