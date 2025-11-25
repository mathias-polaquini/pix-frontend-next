import { NextResponse } from "next/server";
import { serialize } from "cookie";
import path from "path";

export default function POST(){
  const cookie = serialize ("token", "",{
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path:"/",
    maxAge: 0
  });

  const res = NextResponse.json({ok:true});
  res.headers.set("Set-Cookie", cookie);
  return res;
}
