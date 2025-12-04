import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "student" | "staff" | "admin";
  rollNumber?: string;
  staffId?: string;
  adminId?: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "staff", "admin"],
      required: true,
    },
    rollNumber: { type: String, sparse: true },
    staffId: { type: String, sparse: true },
    adminId: { type: String, sparse: true }
  },
  { timestamps: true }
);

UserSchema.index({ rollNumber: 1 }, { unique: true, sparse: true });
UserSchema.index({ staffId: 1 }, { unique: true, sparse: true });
UserSchema.index({ adminId: 1 }, { unique: true, sparse: true });

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
