import nodemailer from "nodemailer";

export const sendResetEmail = async (email: string, resetUrl: string) => {
  const transporter = nodemailer.createTransport({
    // Use Gmail, SendGrid, or Mailtrap for testing
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: '"Your App Support" <support@yourapp.com>',
    to: email,
    subject: "Password Reset Request",
    html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset it. This link expires in 1 hour.</p>`,
  });
};
