import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import LibraryActivity from "@/models/LibraryActivity";
import { verifyToken } from "@/lib/auth";
import User from "@/models/User";
import { JwtPayload } from "jsonwebtoken"; // Import this

// Define what your token looks like
interface CustomJwtPayload extends JwtPayload {
  id: string;
  role: string;
}

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // --- FIX APPLIED HERE: Type Casting ---
    const decoded = verifyToken(token) as CustomJwtPayload | null;

    if (!decoded || typeof decoded === "string" || !decoded.id) {
      return NextResponse.json(
        { success: false, message: "Invalid Session" },
        { status: 401 },
      );
    }

    // Now TypeScript knows decoded.id exists
    const student = await User.findById(decoded.id);
    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 },
      );
    }

    const activities = await LibraryActivity.find({ student: student._id })
      .sort({ date: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: activities,
      studentName: student.name,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 },
    );
  }
}
