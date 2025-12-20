import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Request from "@/models/Request";
import Book from "@/models/Books";
import User from "@/models/User"; 
import { getAuthUser } from "@/lib/getAuthUser";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const authUser = getAuthUser(req);
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

    // 1. Check for duplicate requests (Pending or Approved)
    const existingRequest = await Request.findOne({
      requestedBy: authUser.id,
      bookId: bookId,
      status: { $in: ["pending", "approved"] }
    });

    if (existingRequest) {
      const msg = existingRequest.status === "pending" 
        ? "You already have a pending request for this book." 
        : "You already have this book approved/borrowed.";
      return NextResponse.json({ success: false, message: msg }, { status: 400 });
    }

    // 2. Verify book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      return NextResponse.json({ success: false, message: "Book not found" }, { status: 404 });
    }

    if (book.availableCopies === 0) {
      return NextResponse.json({ success: false, message: "Book not available" }, { status: 400 });
    }

    // 3. Create the request
    const request = await Request.create({
      requestedBy: authUser.id,
      requestedRole: authUser.role,
      bookId,
      status: "pending",
    });

    return NextResponse.json({
      success: true,
      message: "Request sent successfully",
      request,
    });
  } catch (err: any) {
    console.error("REQUEST_POST_ERROR:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
export async function GET() {
  try {
    await connectToDB();

    // 1. Force registration of models by referencing them
    const requests = await Request.find()
      .populate({
        path: "bookId",
        model: "Book", // Use the string name registered in models/Books.ts
        select: "imageUrl bookId title author availableCopies category",
      })
      .populate({
        path: "requestedBy",
        model: "User", 
        select: "name email role rollNumber staffId",
      })
      .lean();

    // 2. DEBUG: Check the first item in the console
    if (requests.length > 0) {
      console.log("CHECKING FIRST BOOK:", requests[0].bookId);
    }

    return NextResponse.json({ success: true, requests });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}


