import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/lib/mongodb";
import LibraryStaff from "@/models/LibraryStaff";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const { staffId, staffName, staffEmail, staffPassword } = await req.json();

    if (!staffId || !staffName || !staffEmail || !staffPassword) {
      return NextResponse.json(
        { message: "All fields required" },
        { status: 400 }
      );
    }

    const exists = await LibraryStaff.findOne({ staffEmail });

    if (exists) {
      return NextResponse.json(
        { message: "Library staff already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(staffPassword, 10);

    const staff = await LibraryStaff.create({
      staffId,
      staffName,
      staffEmail,
      staffPassword: hashedPassword,
    });

    return NextResponse.json(
      { message: "Library staff registered successfully", staff },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
