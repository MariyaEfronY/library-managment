import mongoose, { Schema, Document } from "mongoose";

export interface IBook extends Document {
  title: string;
  author: string;
  category: string;
  availableCopies: number;
}

const BookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  availableCopies: { type: Number, required: true, min: 0 }
});

export default mongoose.models.Book || mongoose.model<IBook>("Book", BookSchema);
