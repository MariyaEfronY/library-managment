import mongoose, { Schema, Document } from "mongoose";

export interface IRequest extends Document {
  requestedBy: mongoose.Types.ObjectId;
  requestedRole: "student" | "staff";
  bookId: mongoose.Types.ObjectId;
  status: "pending" | "approved" | "rejected";
  requestDate: Date;
  returnDate?: Date;
  // --- NEW FIELDS TO ADD ---
  returned: boolean;
  actualReturnDate?: Date;
  fineAmount: number;
  finePaid: boolean;
}

const RequestSchema = new Schema<IRequest>(
  {
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requestedRole: {
      type: String,
      enum: ["student", "staff"],
      required: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    requestDate: { type: Date, default: Date.now },
    returnDate: { type: Date },

    // ✅ ADD THESE FIELDS BELOW
    returned: {
      type: Boolean,
      default: false,
    },
    actualReturnDate: {
      type: Date,
    },
    fineAmount: {
      type: Number,
      default: 0,
    },
    finePaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Request ||
  mongoose.model<IRequest>("Request", RequestSchema);
