import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Staff from "@/models/Staff";
import { connectToDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    await connectToDB();

    const { staffId, staffName, staffEmail, staffPassword, staffDepartment } =
      await req.json();

    if (!staffId || !staffName || !staffEmail || !staffPassword || !staffDepartment) {
      return NextResponse.json(
        { message: "All fields required" },
        { status: 400 }
      );
    }

    const exists = await Staff.findOne({ staffEmail });
    if (exists) {
      return NextResponse.json(
        { message: "Staff already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(staffPassword, 10);

    const newStaff = await Staff.create({
      staffId,
      staffName,
      staffEmail,
      staffPassword: hashedPassword,
      staffDepartment,
    });

    return NextResponse.json(
      { message: "Staff registered successfully", staff: newStaff },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
