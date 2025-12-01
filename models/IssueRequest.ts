import mongoose, { Schema, Document } from "mongoose";

export interface IIssueRequest extends Document {
  studentId: string;
  bookId: string;
  status: "pending" | "approved" | "rejected";
  requestDate: Date;
  issueDate?: Date;
  returnDate?: Date;
}

const issueRequestSchema = new Schema<IIssueRequest>({
  studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
  status: { type: String, default: "pending" },
  requestDate: { type: Date, default: Date.now },
  issueDate: Date,
  returnDate: Date,
});

export default mongoose.models.IssueRequest ||
  mongoose.model<IIssueRequest>("IssueRequest", issueRequestSchema);
