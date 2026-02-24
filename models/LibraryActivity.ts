import mongoose, { Schema, Document } from "mongoose";

export interface IVisitLog {
  timestamp: Date;
  startTime: string;
  endTime: string;
  behavior: string;
  sessionHours: number;
}

export interface ILibraryActivity extends Document {
  student: mongoose.Types.ObjectId;
  rollNumber: string;
  name: string;
  date: Date;
  totalHours: number;
  visitCount: number;
  visitLogs: IVisitLog[];
}

const LibraryActivitySchema = new Schema<ILibraryActivity>(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rollNumber: { type: String, required: true },
    name: { type: String, required: true },
    date: { type: Date, required: true },
    totalHours: { type: Number, default: 0 },
    visitCount: { type: Number, default: 0 },
    visitLogs: [
      {
        timestamp: { type: Date, default: Date.now },
        startTime: String,
        endTime: String,
        behavior: String,
        sessionHours: Number,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.models.LibraryActivity ||
  mongoose.model<ILibraryActivity>("LibraryActivity", LibraryActivitySchema);
