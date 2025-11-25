import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import {serialize} from "cookie";
import path from "path";

type Body = {
  email?: string;
  senha?: string
};

const MOCK_USER = {
  id: "1",
  name: "Mathias",
  email:"mathias@gmail.com",
  senha:"123456"
};

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const JWT_EXPIRES_IN =Number(process.env.JWT_EXPIRES_IN) || 3600;


export async function POST(request: Request){
  try{
    const body: Body = await request.json();
    const{email,senha} = body;
    if(!email || !senha){
      return NextResponse.json({message:"Email e Senha são obrigatórios"}, {status:400});
    }

    if(email !== MOCK_USER.email || senha !== MOCK_USER.senha){
      return NextResponse.json({message:"Usuario ou Senha invalidos"},{status:401})
    }

    const token = jwt.sign({sub: MOCK_USER.id, email: MOCK_USER.email, name: MOCK_USER.name}, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });

    const cookie = serialize("token",token,{ // configura cookie httpOnly
      secure: process.env.NODE_ENV === "production",
      sameSite:"lax",
      path:"/",
      maxAge: JWT_EXPIRES_IN
    });

    const res = NextResponse.json({ok:true, user:{id:MOCK_USER.id, name:MOCK_USER.name, email:MOCK_USER.email}});
    res.headers.set("Set-Cookie", cookie);
    return res;
  }catch (err){
    console.error("LOGIN ERROR", err);
    return NextResponse.json({message: "Erro no servidor"}, {status:500});
  }
}
