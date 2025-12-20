
import { NextRequest, NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { success: true, message: "Logged out" },
    { status: 200 }
  );

  // Clear the auth cookie (ensure the name "token" matches your login cookie name)
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0), // Sets expiration to the past
    path: "/",
  });

  return response;
}