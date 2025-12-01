import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IStudent extends Document {
  name: string;
  email: string;
  password: string;
  borrowedBooks: { bookId: string; returnDate: Date }[];
  requests: { bookId: string; status: 'Pending' | 'Approved' | 'Rejected' }[];
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const studentSchema: Schema<IStudent> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    borrowedBooks: [
      { bookId: { type: Schema.Types.ObjectId, ref: 'Book' }, returnDate: Date },
    ],
    requests: [
      { bookId: { type: Schema.Types.ObjectId, ref: 'Book' }, status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' } },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
studentSchema.pre<IStudent>('save', async function () {
  if (!this.isModified('password')) return; // just skip if not modified
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


// Compare password
studentSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.Student || mongoose.model<IStudent>('Student', studentSchema);
