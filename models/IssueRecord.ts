// models/IssueRecord.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IIssueRecord extends Document {
  studentId: mongoose.Types.ObjectId;
  bookId: mongoose.Types.ObjectId;
  issueDate: Date;
  returnDate: Date; // CRITICAL FIELD
  returned: boolean;
}

const IssueRecordSchema = new Schema<IIssueRecord>({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  issueDate: { type: Date, default: Date.now },
  returnDate: { type: Date, required: true },
  returned: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.IssueRecord || mongoose.model<IIssueRecord>("IssueRecord", IssueRecordSchema);