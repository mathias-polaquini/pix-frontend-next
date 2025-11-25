import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export async function GET(request:Request) {
  try{
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.split(";").map(c => c.trim()).find(c => c.startsWith("token="));
    if(!match){
      return NextResponse.json({logged: false}, {status:401});
    }


    const token = match.replace("token=","");
    const payload = jwt.verify(token, JWT_SECRET) as any;
    return NextResponse.json({logged: true, user:{id:payload.sub, name:payload.name, email:payload.email}});

  }catch(err){
    console.error("ME ERROR", err);
    return NextResponse.json({logged: false},{status:401});
  }
}
