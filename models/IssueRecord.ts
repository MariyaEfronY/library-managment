import mongoose, { Schema, Document } from "mongoose";

export interface IIssueRecord extends Document {
  studentId: mongoose.Types.ObjectId;
  bookId: mongoose.Types.ObjectId;
  issueDate: Date;
  returnDate: Date;
}

const IssueRecordSchema = new Schema<IIssueRecord>({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  issueDate: { type: Date, default: Date.now },
  returnDate: { type: Date, required: true }
});

export default mongoose.models.IssueRecord ||
  mongoose.model<IIssueRecord>("IssueRecord", IssueRecordSchema);
