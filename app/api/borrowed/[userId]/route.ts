import { connectToDB } from "@/lib/mongodb";
import IssueRecord from "@/models/IssueRecord";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  await connectToDB();

  const records = await IssueRecord.find({ studentId: params.userId })
    .populate("bookId");

  return NextResponse.json(records);
}
