import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectToDB } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const body = await req.json();
    const { name, email, password, role, rollNumber, staffId, adminId } = body;

    // Email exists?
    const exists = await User.findOne({ email });
    if (exists)
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );

    // Role validation
    if (role === "student" && !rollNumber)
      return NextResponse.json(
        { error: "Roll Number is required for students" },
        { status: 400 }
      );

    if (role === "staff" && !staffId)
      return NextResponse.json(
        { error: "Staff ID is required for staff" },
        { status: 400 }
      );

    if (role === "admin" && !adminId)
      return NextResponse.json(
        { error: "Admin ID is required for admin" },
        { status: 400 }
      );

    // Check unique IDs
    if (rollNumber && (await User.findOne({ rollNumber })))
      return NextResponse.json(
        { error: "Roll Number already exists" },
        { status: 400 }
      );

    if (staffId && (await User.findOne({ staffId })))
      return NextResponse.json(
        { error: "Staff ID already exists" },
        { status: 400 }
      );

    if (adminId && (await User.findOne({ adminId })))
      return NextResponse.json(
        { error: "Admin ID already exists" },
        { status: 400 }
      );

      

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
    return NextResponse.json(
      { error: error.message || "Server Error" },
      { status: 500 }
    );
  }
}
