import { NextRequest, NextResponse } from "next/server";
import {connectDB} from "@/lib/db";
import Book from "@/models/Book";

// UPDATE book details
export async function PUT(req: NextRequest, { params }: any) {
  try {
    await connectDB();
    const { id } = params;

    const data = await req.json();

    const updatedBook = await Book.findByIdAndUpdate(id, data, { new: true });

    if (!updatedBook)
      return NextResponse.json({ success: false, message: "Book not found" }, { status: 404 });

    return NextResponse.json({ success: true, book: updatedBook });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Update failed" }, { status: 500 });
  }
}

// DELETE book
export async function DELETE(req: NextRequest, { params }: any) {
  try {
    await connectDB();
    const { id } = params;

    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook)
      return NextResponse.json({ success: false, message: "Book not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Book deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Delete failed" }, { status: 500 });
  }
}
