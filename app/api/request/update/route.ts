import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import IssueRequest from "@/models/IssueRequest";
import Book from "@/models/Book";

export async function POST(req: Request) {
  await connectDB();

  const { requestId, status, issueDate, returnDate } = await req.json();

  const requestData = await IssueRequest.findById(requestId);

  if (!requestData)
    return NextResponse.json({ message: "Not Found" }, { status: 404 });

  // Reduce available copies if approved
  if (status === "approved") {
    await Book.findByIdAndUpdate(requestData.bookId, {
      $inc: { availableCopies: -1 },
    });
  }

  requestData.status = status;
  requestData.issueDate = issueDate || null;
  requestData.returnDate = returnDate || null;

  await requestData.save();

  return NextResponse.json({ message: "Updated" });
}
