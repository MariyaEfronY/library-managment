import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Book from "@/models/Books";
import cloudinary from "@/lib/cloudinary";

export const addBook = async (req: NextRequest) => {
  try {
    await connectToDB();
    const formData = await req.formData();

    const bookId = formData.get("bookId") as string;
    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const category = formData.get("category") as string;
    const availableCopies = Number(formData.get("availableCopies"));
    const status = formData.get("status") as string;
    const image: File | null = formData.get("image") as unknown as File;

    if (!bookId || !title || !author || !category || !status)
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );

    const existing = await Book.findOne({ bookId });
    if (existing)
      return NextResponse.json(
        { success: false, message: "Book ID already exists" },
        { status: 400 }
      );

    let imageUrl = "";
    if (image) {
      const arrayBuffer = await image.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");

      const upload = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${base64}`,
        { folder: "library_books" }
      );

      imageUrl = upload.secure_url;
    }

    const book = await Book.create({
      bookId,
      title,
      author,
      category,
      availableCopies,
      status,
      imageUrl,
    });

    return NextResponse.json(
      { success: true, message: "Book added", book },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message });
  }
};

export const getBooks = async () => {
  try {
    await connectToDB();
    const books = await Book.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, books }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message });
  }
};

export const getSingleBook = async (bookId: string) => {
  try {
    await connectToDB();
    const book = await Book.findOne({ bookId });

    if (!book)
      return NextResponse.json(
        { success: false, message: "Book not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, book });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message });
  }
};

export const updateBook = async (req: NextRequest, bookId: string) => {
  try {
    await connectToDB();

    const contentType = req.headers.get("content-type") || "";
    let data: any = {};

    if (contentType.includes("application/json")) {
      data = await req.json();
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      data = {
        title: formData.get("title") as string,
        author: formData.get("author") as string,
        category: formData.get("category") as string,
        availableCopies: Number(formData.get("availableCopies")),
        status: formData.get("status") as string,
        image: formData.get("image") as unknown as File,
      };
    } else {
      return NextResponse.json({
        success: false,
        message: 'Content-Type must be "multipart/form-data" or "application/json"',
      }, { status: 400 });
    }

    const book = await Book.findOne({ bookId });
    if (!book) return NextResponse.json({ success: false, message: "Book not found" }, { status: 404 });

    // Update fields
    if (data.title) book.title = data.title;
    if (data.author) book.author = data.author;
    if (data.category) book.category = data.category;
    if (data.availableCopies) book.availableCopies = data.availableCopies;
    if (data.status) book.status = data.status;

    // Update image if provided
    if (data.image) {
      const base64 = Buffer.from(await data.image.arrayBuffer()).toString("base64");
      const upload = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${base64}`,
        { folder: "library_books" }
      );
      book.imageUrl = upload.secure_url;
    }

    await book.save();

    return NextResponse.json({ success: true, message: "Book updated", book });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
};



export const deleteBook = async (bookId: string) => {
  try {
    await connectToDB();

    const deleted = await Book.findOneAndDelete({ bookId });

    if (!deleted)
      return NextResponse.json(
        { success: false, message: "Book not found" },
        { status: 404 }
      );

    return NextResponse.json({
      success: true,
      message: "Book deleted",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message });
  }
};
