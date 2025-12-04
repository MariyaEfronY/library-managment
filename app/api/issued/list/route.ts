import { NextRequest, NextResponse } from "next/server";
import IssueRecord from "@/models/IssueRecord";
import { connectToDB } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectToDB();

    const records = await IssueRecord.find()
      .populate("studentId")
      .populate("bookId");

    return NextResponse.json(records);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
