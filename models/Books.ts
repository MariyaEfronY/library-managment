import mongoose, { Schema, Document } from "mongoose";

export interface IBook extends Document {
  bookId: string;              // NEW FIELD
  title: string;
  author: string;
  category: string;
  availableCopies: number;
  status: "valid" | "invalid";    
  imageUrl?: string;
}

const BookSchema = new Schema<IBook>({
  bookId: { type: String, required: true, unique: true },   // REQUIRED + UNIQUE
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  availableCopies: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ["valid", "invalid"], default: "valid" },
  imageUrl: { type: String },
});

export default mongoose.models.Book || mongoose.model("Book", BookSchema);
