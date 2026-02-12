import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import User from "@/models/User";
import { connectToDB } from "@/lib/mongodb";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    console.log("--- Forgot Password Process Started ---");
    await connectToDB();

    const { email } = await req.json();
    console.log("Looking for user with email:", email);

    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ USER NOT FOUND in database for:", email);
      // We still return success for security, but we know why no email was sent
      return NextResponse.json({
        success: true,
        message: "If an account exists, a reset link has been sent.",
      });
    }

    console.log("✅ USER FOUND:", user.name);

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);
    await user.save();
    console.log("✅ Reset token saved to database");

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${resetToken}`;
    console.log("Attempting to send email via Resend to:", email);

    // WE AWAIT THIS TO CATCH ERRORS
    const { data, error } = await resend.emails.send({
      from: `Smart Library <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Reset Your Password",
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    });

    if (error) {
      console.error("❌ RESEND API ERROR:", error);
      return NextResponse.json(
        { success: false, message: "Email service failed" },
        { status: 500 },
      );
    }

    console.log("🚀 RESEND SUCCESS:", data);
    return NextResponse.json({
      success: true,
      message: "Reset link sent to your email!",
    });
  } catch (err: any) {
    console.error("🔥 SEVERE ERROR:", err.message);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 },
    );
  }
}
