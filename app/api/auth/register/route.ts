import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectToDB } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const { name, email, password, role, rollNumber, staffId, adminId } = await req.json();

    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists)
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });

    // Validate role-based IDs
    if (role === "student" && !rollNumber)
      return NextResponse.json({ error: "Roll Number required for students" }, { status: 400 });

    if (role === "staff" && !staffId)
      return NextResponse.json({ error: "Staff ID required for staff" }, { status: 400 });

    if (role === "admin" && !adminId)
      return NextResponse.json({ error: "Admin ID required for admin" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      rollNumber,
      staffId,
      adminId,
    });

    return NextResponse.json(
      { message: "User registered successfully", user: newUser },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
