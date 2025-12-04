import { NextRequest } from "next/server";
import { getSingleBook, updateBook, deleteBook } from "@/controllers/bookController";

export async function GET(req: NextRequest, context: { params: Promise<{ bookId: string }> }) {
  const { bookId } = await context.params; // UNWRAP the promise
  return getSingleBook(bookId);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ bookId: string }> }) {
  const { bookId } = await context.params;
  return updateBook(req, bookId);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ bookId: string }> }) {
  const { bookId } = await context.params;
  return deleteBook(bookId);
}
