import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  const res = NextResponse.json({ ok: true });

  res.headers.set(
    "Set-Cookie",
    `token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`
  );

  return res;
}
