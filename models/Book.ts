import mongoose, { Schema, Document } from "mongoose";

export interface IBook extends Document {
  bookId: string;
  title: string;
  author: string;
  category: string;
  availableCopies: number;
  imageUrl?: string;
}

const BookSchema = new Schema<IBook>(
  {
    bookId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    availableCopies: { type: Number, required: true },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

// FIX: prevents overwrite error in Next.js
export default mongoose.models.Book || mongoose.model("Book", BookSchema);
