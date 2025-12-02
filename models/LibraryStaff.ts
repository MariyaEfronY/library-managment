import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILibraryStaff extends Document {
  staffId: string;
  staffName: string;
  staffEmail: string;
  staffPassword: string;
  role: string;                // library-staff
  permissions: string[];       // optional for future expansion
}

const LibraryStaffSchema = new Schema<ILibraryStaff>(
  {
    staffId: { type: String, required: true, unique: true },
    staffName: { type: String, required: true },
    staffEmail: { type: String, required: true, unique: true },
    staffPassword: { type: String, required: true },

    role: {
      type: String,
      default: "library-staff",
    },

    permissions: {
      type: [String],
      default: [
        "approve_student_request",
        "approve_staff_request",
        "add_books",
        "edit_books",
        "delete_books",
        "update_library_hours",
        "issue_book",
        "track_borrowed",
      ],
    },
  },
  { timestamps: true }
);

const LibraryStaff: Model<ILibraryStaff> =
  mongoose.models.LibraryStaff ||
  mongoose.model<ILibraryStaff>("LibraryStaff", LibraryStaffSchema);

export default LibraryStaff;
