import mongoose from "mongoose";

export const connectToDB = async () => {
  if (mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Error:", error);
  }
};
