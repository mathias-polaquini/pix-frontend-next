import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const match = cookie.split(";").find((c) => c.trim().startsWith("token="));

    if (!match)
      return NextResponse.json({ logged: false }, { status: 401 });

    const token = match.replace("token=", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");

    return NextResponse.json({ logged: true, user: decoded });
  } catch {
    return NextResponse.json({ logged: false }, { status: 401 });
  }
}
