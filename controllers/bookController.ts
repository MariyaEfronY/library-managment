import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Book from "@/models/Books";
import cloudinary from "@/lib/cloudinary";
import IssueRecord from "@/models/IssueRecord";
import streamifier from "streamifier";

// controllers/issueController.ts

export const payFine = async (req: NextRequest) => {
  try {
    await connectToDB();
    const { issueId } = await req.json();

    if (!issueId) {
      return NextResponse.json(
        { success: false, message: "Issue ID is required" },
        { status: 400 },
      );
    }

    const record = await IssueRecord.findById(issueId);

    if (!record) {
      return NextResponse.json(
        { success: false, message: "Record not found" },
        { status: 404 },
      );
    }

    if (record.fineAmount === 0) {
      return NextResponse.json(
        { success: false, message: "No fine exists for this record" },
        { status: 400 },
      );
    }

    // Update the payment status
    record.finePaid = true;
    await record.save();

    return NextResponse.json({
      success: true,
      message: "Fine marked as paid successfully",
      record,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 },
    );
  }
};

export const returnBook = async (req: NextRequest) => {
  try {
    await connectToDB();
    const { issueId } = await req.json();

    const record = await IssueRecord.findById(issueId);
    if (!record || record.returned) {
      return NextResponse.json(
        { success: false, message: "Invalid or already returned record" },
        { status: 400 },
      );
    }

    // --- Overdue Logic ---
    const today = new Date();
    const dueDate = new Date(record.returnDate);
    let fineAmount = 0;
    const finePerDay = 5; // Set your currency amount here

    if (today > dueDate) {
      // Calculate difference in milliseconds and convert to days
      const diffTime = Math.abs(today.getTime() - dueDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fineAmount = diffDays * finePerDay;
    }

    // Update Issue Record
    record.returned = true;
    // record.actualReturnDate = today; // Optional: add this to your schema to track performance
    await record.save();

    // Update Book Inventory
    await Book.findByIdAndUpdate(record.bookId, {
      $inc: { availableCopies: 1 },
    });

    return NextResponse.json({
      success: true,
      message:
        fineAmount > 0
          ? `Book returned with a fine of $${fineAmount}`
          : "Book returned on time",
      overdueDays: fineAmount > 0 ? fineAmount / finePerDay : 0,
      fineAmount,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 },
    );
  }
};

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
    const image = formData.get("image") as File | null;

    if (!bookId || !title || !author || !category || !status) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    const existing = await Book.findOne({ bookId });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Book ID already exists" },
        { status: 400 },
      );
    }

    let imageUrl = "";

    if (image) {
      const buffer = Buffer.from(await image.arrayBuffer());

      imageUrl = await new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "library_books" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result?.secure_url || "");
          },
        );

        streamifier.createReadStream(buffer).pipe(uploadStream);
      });
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
      { status: 201 },
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 },
    );
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
        { status: 404 },
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
      return NextResponse.json(
        {
          success: false,
          message:
            'Content-Type must be "multipart/form-data" or "application/json"',
        },
        { status: 400 },
      );
    }

    const book = await Book.findOne({ bookId });
    if (!book)
      return NextResponse.json(
        { success: false, message: "Book not found" },
        { status: 404 },
      );

    // Update fields
    if (data.title) book.title = data.title;
    if (data.author) book.author = data.author;
    if (data.category) book.category = data.category;
    if (data.availableCopies) book.availableCopies = data.availableCopies;
    if (data.status) book.status = data.status;

    // Update image if provided
    if (data.image) {
      const base64 = Buffer.from(await data.image.arrayBuffer()).toString(
        "base64",
      );
      const upload = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${base64}`,
        { folder: "library_books" },
      );
      book.imageUrl = upload.secure_url;
    }

    await book.save();

    return NextResponse.json({ success: true, message: "Book updated", book });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 },
    );
  }
};

export const deleteBook = async (bookId: string) => {
  try {
    await connectToDB();

    const deleted = await Book.findOneAndDelete({ bookId });

    if (!deleted)
      return NextResponse.json(
        { success: false, message: "Book not found" },
        { status: 404 },
      );

    return NextResponse.json({
      success: true,
      message: "Book deleted",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message });
  }
};
