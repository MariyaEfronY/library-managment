import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Request from "@/models/Request";
import Book from "@/models/Books";
import { getAuthUser } from "@/lib/getAuthUser";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const authUser = getAuthUser(req); // ✅ pass req
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { bookId } = await req.json();
    if (!bookId) {
      return NextResponse.json(
        { success: false, message: "Book ID required" },
        { status: 400 }
      );
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return NextResponse.json(
        { success: false, message: "Book not found" },
        { status: 404 }
      );
    }

    if (book.availableCopies === 0) {
      return NextResponse.json(
        { success: false, message: "Book not available" },
        { status: 400 }
      );
    }

    const request = await Request.create({
      requestedBy: authUser.id,
      requestedRole: authUser.role,
      bookId,
      status: "pending",
    });

    return NextResponse.json({
      success: true,
      message: "Request sent",
      request,
    });
  } catch (err: any) {
    console.error("REQUEST ERROR:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDB();

    const requests = await Request.find()
      .populate(
  "requestedBy",
  "name email role rollNumber staffId"
)

      .populate("bookId", "imageUrl bookId title author availableCopies");

    console.log("Fetched requests:", requests); // 🔍 important

    return NextResponse.json({ success: true, requests });
  } catch (err: any) {
    console.error("GET REQUESTS ERROR:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}


