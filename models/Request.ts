import mongoose, { Schema, Document } from "mongoose";

export interface IRequest extends Document {
  requestedBy: mongoose.Types.ObjectId; // user id
  requestedRole: "student" | "staff";
  bookId: mongoose.Types.ObjectId;
  status: "pending" | "approved" | "rejected";
  requestDate: Date;
}

const RequestSchema = new Schema<IRequest>({
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
});

export default mongoose.models.Request ||
  mongoose.model<IRequest>("Request", RequestSchema);
