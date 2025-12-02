import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBook extends Document {
  bookId: string;
  title: string;
  author: string;
  category: string;
  availableCopies: number;
  bookImage: string; // filename (stored locally)
}

const BookSchema = new Schema<IBook>(
  {
    bookId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    availableCopies: { type: Number, required: true },
    bookImage: { type: String, default: "" }
  },
  { timestamps: true }
);

const Book: Model<IBook> =
  mongoose.models.Book || mongoose.model<IBook>("Book", BookSchema);

export default Book;
