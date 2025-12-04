import { NextRequest, NextResponse } from "next/server";
import IssueRecord from "@/models/IssueRecord";
import Book from "@/models/Books";
import { connectToDB } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const { issueId } = await req.json();

    const issue = await IssueRecord.findById(issueId);
    if (!issue)
      return NextResponse.json({ error: "Record not found" }, { status: 404 });

    // Increase book copies back
    await Book.findByIdAndUpdate(issue.bookId, {
      $inc: { availableCopies: 1 },
    });

    await IssueRecord.findByIdAndDelete(issueId);

    return NextResponse.json({ message: "Book returned successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
