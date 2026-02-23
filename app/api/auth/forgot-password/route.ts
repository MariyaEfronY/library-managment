import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import User from "@/models/User";
import { connectToDB } from "@/lib/mongodb";
import { transporter } from "@/lib/nodemailer";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const { email } = await req.json();

    // 💡 Debug: Check if env variables are loading
    console.log("Using Email:", process.env.EMAIL_USER);
    console.log("Password Length:", process.env.EMAIL_PASS?.length);

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "Check your inbox for a reset link.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);
    await user.save();

    const resetUrl = `${req.nextUrl.origin}/auth/reset-password/${resetToken}`;

    const mailOptions = {
      from: `"Smart Library" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully to:", email);

    return NextResponse.json({ success: true, message: "Reset link sent!" });
  } catch (err: any) {
    console.error("FULL ERROR:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 },
    );
  }
}
