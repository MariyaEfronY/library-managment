import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Request from "@/models/Request";
import Book from "@/models/Books";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const { userId, role, bookId } = await req.json();

    if (!userId || !role || !bookId) {
      return NextResponse.json({ message: "All fields required" }, { status: 400 });
    }

    const book = await Book.findById(bookId);
    if (!book || book.status === "invalid") {
      return NextResponse.json({ message: "Book not available" }, { status: 400 });
    }

    const request = await Request.create({
      requestedBy: userId,
      requestedRole: role,
      bookId,
    });

    return NextResponse.json(
      { message: "Request submitted", request },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
