import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import IssueRecord from "@/models/IssueRecord";

export async function POST(req: Request) {
  try {
    await connectToDB();

    const { userId } = await req.json();

    const records = await IssueRecord.find({ studentId: userId })
      .populate("bookId")
      .sort({ issueDate: -1 });

    return NextResponse.json({ success: true, records });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
