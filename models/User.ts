import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "student" | "staff" | "admin";

  // Optional based on role
  rollNumber?: string; // For Students
  staffId?: string;    // For Staff
  adminId?: string;    // For Admin
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },

  email: { type: String, unique: true, required: true },

  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["student", "staff", "admin"],
    required: true,
  },

  // Students only
  rollNumber: {
    type: String,
    required: function () {
      return this.role === "student";
    },
    unique: function () {
      return this.role === "student";
    },
  },

  // Staff only
  staffId: {
    type: String,
    required: function () {
      return this.role === "staff";
    },
    unique: function () {
      return this.role === "staff";
    },
  },

  // Admin only
  adminId: {
    type: String,
    required: function () {
      return this.role === "admin";
    },
    unique: function () {
      return this.role === "admin";
    },
  },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
