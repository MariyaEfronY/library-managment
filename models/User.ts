import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "student" | "staff" | "admin";
  phone: number;
  rollNumber?: string;
  staffId?: string;
  adminId?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
    role: {
      type: String,
      enum: ["student", "staff", "admin"],
      required: true,
    },
    // We define the uniqueness and sparse property directly here
    rollNumber: { type: String, unique: true, sparse: true },
    staffId: { type: String, unique: true, sparse: true },
    adminId: { type: String, unique: true, sparse: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
