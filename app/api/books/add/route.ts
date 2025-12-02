import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Book from "@/models/Book";
import { upload } from "@/lib/multer";
import { NextRequest } from "next/server";
import { promisify } from "util";

// Convert multer middleware into a promise
const uploadMiddleware = upload.single("bookImage");
const uploadAsync = promisify(uploadMiddleware);

export const config = {
  api: {
    bodyParser: false // important for multer
  },
};

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const formData = await req.formData();

    const bookId = formData.get("bookId") as string;
    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const category = formData.get("category") as string;
    const availableCopies = Number(formData.get("availableCopies"));
    const file = formData.get("bookImage") as File | null;

    let savedFileName = "";

    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const fileName = `${Date.now()}-${file.name}`;
      const fs = require("fs");
      fs.writeFileSync(`public/uploads/books/${fileName}`, buffer);

      savedFileName = fileName;
    }

    const exists = await Book.findOne({ bookId });
    if (exists) {
      return NextResponse.json(
        { message: "Book already exists" },
        { status: 400 }
      );
    }

    const book = await Book.create({
      bookId,
      title,
      author,
      category,
      availableCopies,
      bookImage: savedFileName,
    });

    return NextResponse.json(
      { message: "Book added successfully", book },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
