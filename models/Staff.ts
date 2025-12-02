// models/Staff.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStaff extends Document {
  staffId: string;
  staffName: string;
  staffEmail: string;
  staffPassword: string;
  staffDepartment: string;
}

const StaffSchema = new Schema<IStaff>(
  {
    staffId: { type: String, required: true, unique: true },
    staffName: { type: String, required: true },
    staffEmail: { type: String, required: true, unique: true },
    staffPassword: { type: String, required: true },
    staffDepartment: { type: String, required: true },
  },
  { timestamps: true }
);

const Staff: Model<IStaff> =
  mongoose.models.Staff || mongoose.model<IStaff>("Staff", StaffSchema);

export default Staff;
