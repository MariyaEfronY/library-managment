import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import LibraryStaff from "@/models/LibraryStaff";
import { connectToDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const { staffEmail, staffPassword } = await req.json();

    const staff = await LibraryStaff.findOne({ staffEmail });

    if (!staff)
      return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });

    const isMatch = await bcrypt.compare(staffPassword, staff.staffPassword);

    if (!isMatch)
      return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });

    const token = jwt.sign(
      { id: staff._id, role: "library-staff" },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    return NextResponse.json({
      message: "Login successful",
      token,
      staff,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
