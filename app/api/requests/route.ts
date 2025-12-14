import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Request from "@/models/Request";
import Book from "@/models/Books";

export async function POST(req: Request) {
  try {
    await connectToDB();

    const { requestedBy, requestedRole, bookId } = await req.json();

    if (!requestedBy || !requestedRole || !bookId) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    const book = await Book.findById(bookId);
    if (!book || book.status !== "valid") {
      return NextResponse.json(
        { success: false, message: "Book not available" },
        { status: 400 }
      );
    }

    const existing = await Request.findOne({
      requestedBy,
      bookId,
      status: "pending",
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Already requested" },
        { status: 400 }
      );
    }

    const request = await Request.create({
      requestedBy,
      requestedRole,
      bookId,
    });

    return NextResponse.json(
      { success: true, message: "Book request sent", request },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
