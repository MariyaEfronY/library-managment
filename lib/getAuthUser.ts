import { verifyToken } from "@/lib/auth";
import { NextRequest } from "next/server";

export const getAuthUser = (req: NextRequest) => {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    return verifyToken(token) as {
      id: string;
      role: "student" | "staff" | "admin";
    };
  } catch {
    return null;
  }
};
