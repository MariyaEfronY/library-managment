import mongoose from "mongoose";

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      return Response.json(
        { error: "MONGODB_URI not found in environment variables" },
        { status: 400 }
      );
    }

    // Connect if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    return Response.json({
      status: "success",
      message: "MongoDB connected successfully",
      state: mongoose.connection.readyState, // 1 = connected
    });
  } catch (error: any) {
    return Response.json(
      {
        status: "error",
        message: "MongoDB connection failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
