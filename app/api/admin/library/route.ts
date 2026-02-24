import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import LibraryActivity from "@/models/LibraryActivity";

// GET Method: Handles two different needs
export async function GET(req: Request) {
  await connectToDB();
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("mode");

    // Mode 1: Fetch students for the form dropdown
    if (mode === "students") {
      const students = await User.find({ role: "student" })
        .select("name rollNumber _id")
        .lean();
      return NextResponse.json(students);
    }

    // Mode 2: Fetch all activity logs for the management table
    const activities = await LibraryActivity.find().sort({ date: -1 }).lean();
    return NextResponse.json(activities);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await connectToDB();
  try {
    const { rollNumber, date, startTime, endTime, behavior } = await req.json();

    // 1. Validation: Ensure rollNumber is provided
    if (!rollNumber) {
      return NextResponse.json(
        { error: "Roll Number is required" },
        { status: 400 },
      );
    }

    // 2. Calculate session duration
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    let duration = endH + endM / 60 - (startH + startM / 60);
    if (duration < 0) duration += 24;
    const sessionHours = parseFloat(duration.toFixed(2));

    // 3. Find student by Roll Number (Case-insensitive)
    const student = await User.findOne({
      rollNumber: { $regex: new RegExp(`^${rollNumber}$`, "i") },
    });

    if (!student) {
      return NextResponse.json(
        {
          error: `No student found with Roll Number: ${rollNumber}`,
        },
        { status: 404 },
      );
    }

    const recordDate = new Date(date);
    recordDate.setHours(0, 0, 0, 0);

    const logEntry = {
      timestamp: new Date(),
      startTime,
      endTime,
      behavior,
      sessionHours,
    };

    // 4. Update or Create Activity based on Student's ID and Date
    const activity = await LibraryActivity.findOneAndUpdate(
      { student: student._id, date: recordDate },
      {
        $set: {
          name: student.name,
          rollNumber: student.rollNumber, // Ensure correct casing from DB
        },
        $inc: { visitCount: 1, totalHours: sessionHours },
        $push: { visitLogs: logEntry },
      },
      { returnDocument: "after", upsert: true },
    );

    return NextResponse.json({
      message: "Visit logged successfully",
      data: activity,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function PATCH(req: Request) {
  await connectToDB();
  try {
    const { activityId, logId, startTime, endTime, behavior } =
      await req.json();

    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    let duration = endH + endM / 60 - (startH + startM / 60);
    if (duration < 0) duration += 24;
    const sessionHours = parseFloat(duration.toFixed(2));

    // FIX: Using returnDocument: "after" instead of "new: true" for modern Mongoose
    const activity = await LibraryActivity.findOneAndUpdate(
      { _id: activityId, "visitLogs._id": logId },
      {
        $set: {
          "visitLogs.$.startTime": startTime,
          "visitLogs.$.endTime": endTime,
          "visitLogs.$.behavior": behavior,
          "visitLogs.$.sessionHours": sessionHours,
        },
      },
      { returnDocument: "after" },
    );

    if (activity) {
      activity.totalHours = activity.visitLogs.reduce(
        (acc: number, log: any) => acc + (log.sessionHours || 0),
        0,
      );
      await activity.save();
    }

    return NextResponse.json({
      message: "Updated successfully",
      data: activity,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  await connectToDB();
  try {
    const { searchParams } = new URL(req.url);
    const activityId = searchParams.get("activityId");
    const logId = searchParams.get("logId");

    const activity = await LibraryActivity.findByIdAndUpdate(
      activityId,
      { $pull: { visitLogs: { _id: logId } }, $inc: { visitCount: -1 } },
      { returnDocument: "after" },
    );

    if (activity) {
      activity.totalHours = activity.visitLogs.reduce(
        (acc: number, log: any) => acc + (log.sessionHours || 0),
        0,
      );
      await activity.save();
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
