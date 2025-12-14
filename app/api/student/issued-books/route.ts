import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import IssueRecord from "@/models/IssueRecord";

export async function GET(req: Request) {
  await connectToDB();

  const userId = req.headers.get("x-user-id");

  const books = await IssueRecord.find({ studentId: userId })
    .populate("bookId", "title author category imageUrl returnDate");

  return NextResponse.json({ success: true, books });
}
