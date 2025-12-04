import { NextRequest } from "next/server";
import { addBook, getBooks } from "@/controllers/bookController";

// GET all books
export async function GET() {
  return getBooks();
}

// POST add a new book
export async function POST(req: NextRequest) {
  return addBook(req);
}
