import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectToDB } from "@/lib/mongodb";
import { generateToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const body = await req.json();

    const { id, password } = body;

    if (!id || !password) {
      console.log("❌ Missing ID or Password");
      return NextResponse.json(
        { error: "ID and password are required" },
        { status: 400 }
      );
    }

    console.log("🔎 Searching for user with ID:", id);

    const user =
      (await User.findOne({ rollNumber: id })) ||
      (await User.findOne({ staffId: id })) ||
      (await User.findOne({ adminId: id }));


    if (!user) {
      console.log("❌ No user found for ID:", id);
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔐 PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      console.log("❌ Incorrect password");
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 400 }
      );
    }

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
    console.log("💥 SERVER ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
