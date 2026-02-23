import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import IssueRecord from "@/models/IssueRecord";

export async function GET() {
  try {
    await connectToDB();

    const issues = await IssueRecord.find()
      .populate({
        path: "studentId",
        select: "name email role phone rollNumber staffId adminId",
      })
      .populate({
        path: "bookId",
        select: "title author bookId category",
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ issues });
  } catch (error) {
    console.error("Fetch Issues Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch issues" },
      { status: 500 },
    );
  }
}
