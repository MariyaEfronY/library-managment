import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectToDB } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const body = await req.json();
    const { name, phone, email, password, role } = body;

    // --- NORMALIZATION LOGIC ---
    // 1. Emails should always be lowercase
    const normalizedEmail = email?.trim().toLowerCase();

    // 2. IDs should be Trimmed and Uppercased
    const normalizedRollNumber = body.rollNumber?.trim().toUpperCase();
    const normalizedStaffId = body.staffId?.trim().toUpperCase();
    const normalizedAdminId = body.adminId?.trim().toUpperCase();

    // Check if Email exists (using normalized version)
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists)
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 },
      );

    // Role validation
    if (role === "student" && !normalizedRollNumber)
      return NextResponse.json(
        { error: "Roll Number is required for students" },
        { status: 400 },
      );

    if (role === "staff" && !normalizedStaffId)
      return NextResponse.json(
        { error: "Staff ID is required for staff" },
        { status: 400 },
      );

    if (role === "admin" && !normalizedAdminId)
      return NextResponse.json(
        { error: "Admin ID is required for admin" },
        { status: 400 },
      );

    // Check unique IDs (using normalized versions)
    if (
      normalizedRollNumber &&
      (await User.findOne({ rollNumber: normalizedRollNumber }))
    )
      return NextResponse.json(
        { error: "Roll Number already exists" },
        { status: 400 },
      );

    if (
      normalizedStaffId &&
      (await User.findOne({ staffId: normalizedStaffId }))
    )
      return NextResponse.json(
        { error: "Staff ID already exists" },
        { status: 400 },
      );

    if (
      normalizedAdminId &&
      (await User.findOne({ adminId: normalizedAdminId }))
    )
      return NextResponse.json(
        { error: "Admin ID already exists" },
        { status: 400 },
      );

    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user with normalized data
    const newUser = await User.create({
      name,
      email: normalizedEmail,
      phone,
      password: hashedPassword,
      role,
      rollNumber: normalizedRollNumber,
      staffId: normalizedStaffId,
      adminId: normalizedAdminId,
    });

    return NextResponse.json(
      { message: "User registered successfully", user: newUser },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Server Error" },
      { status: 500 },
    );
  }
}
