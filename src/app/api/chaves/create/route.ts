import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { verifyToken } from "@/utils/jwt";

export const runtime = "nodejs";

type JWTPayload = {
  sub: number;
  name: string;
  email: string;
  iat: number;
  exp: number;
};
export async function POST(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const match = cookie.split(";").find((c) => c.trim().startsWith("token="));

    if (!match) {
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }
    const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
    const token = match.replace("token=", "");
    const decoded = verifyToken(token, JWT_SECRET);
    const body: { chave: string; tipo: string } = await req.json();
    const { chave, tipo } = body;
    if (!chave || !tipo) {
      return NextResponse.json(
        { message: "Chave e tipo obrigatórios" },
        { status: 400 }
      );
    }
    const existe = await prisma.chave.findUnique({
      where: { chave },
    });
    if (existe) {
      return NextResponse.json(
        { message: "Chave já existe" },
        { status: 409 }
      );
    }
    const nova = await prisma.chave.create({
      data: {
        chave,
        tipo,
        usuarioId: decoded.sub,
      },
    });

    return NextResponse.json({ ok: true, chave: nova });
  } catch (err) {
    console.error("CHAVE CREATE ERROR", err);
    return NextResponse.json({ message: "Erro interno" }, { status: 500 });
  }
}
