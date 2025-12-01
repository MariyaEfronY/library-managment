import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import IssueRequest from "@/models/IssueRequest";

export async function POST(req: Request) {
  await connectDB();
  const { studentId, bookId } = await req.json();

  const newRequest = await IssueRequest.create({
    studentId,
    bookId,
    status: "pending",
  });

  return NextResponse.json(newRequest);
}
