import mongoose, { Schema, Document, models } from "mongoose";

export interface IIssuedBook extends Document {
  bookId: mongoose.Types.ObjectId;
  issuedTo: mongoose.Types.ObjectId; 
  userType: "student" | "staff"; 
  issueDate: Date;
  returnDate: Date;
  status: "borrowed" | "returned";
}

const IssuedBookSchema = new Schema<IIssuedBook>(
  {
    bookId: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    issuedTo: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    userType: {
      type: String,
      enum: ["student", "staff"],
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    returnDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["borrowed", "returned"],
      default: "borrowed",
    },
  },
  { timestamps: true }
);

export default models.IssuedBook || mongoose.model("IssuedBook", IssuedBookSchema);
