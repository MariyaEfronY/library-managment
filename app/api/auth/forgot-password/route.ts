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

    // const mailOptions = {
    //   from: `"Smart Library" <${process.env.EMAIL_USER}>`,
    //   to: email,
    //   subject: "Password Reset Request",
    //   html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    // };

    const mailOptions = {
      from: `"Smart Library" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Smart Library – Password Reset Request",
      html: `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:40px;">
    
    <div style="max-width:600px; margin:auto; background:white; border-radius:10px; padding:30px; box-shadow:0 5px 20px rgba(0,0,0,0.08);">
      
      <h2 style="color:#2c3e50; text-align:center;">
        🔐 Password Reset Request
      </h2>

      <p style="font-size:16px; color:#555;">
        Hello,
      </p>

      <p style="font-size:16px; color:#555;">
        We received a request to reset the password for your 
        <b>Smart Library</b> account.
      </p>

      <p style="font-size:16px; color:#555;">
        Click the button below to create a new password.
      </p>

      <div style="text-align:center; margin:30px 0;">
        <a href="${resetUrl}" 
           style="
            background:#2563eb;
            color:white;
            padding:14px 28px;
            text-decoration:none;
            border-radius:6px;
            font-size:16px;
            font-weight:bold;
            display:inline-block;
           ">
           Reset Password
        </a>
      </div>

      <p style="font-size:14px; color:#777;">
        ⏰ This password reset link will expire in <b>10 Minutes</b>.
      </p>

      <p style="font-size:14px; color:#777;">
        If you did not request a password reset, please ignore this email. 
        Your account will remain secure.
      </p>

      <hr style="margin:25px 0; border:none; border-top:1px solid #eee;" />

      <p style="font-size:13px; color:#999; text-align:center;">
        Smart Library System <br/>
        SJC
      </p>

    </div>

  </div>
  `,
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
