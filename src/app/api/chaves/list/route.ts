import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";
export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const match = cookie.split(";").find((c) => c.trim().startsWith("token="));
    if (!match)
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    const token = match.replace("token=", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret") as any;
    const chaves = await prisma.chave.findMany({
      where: { usuarioId: Number(decoded.sub) },
    });
    return NextResponse.json(chaves);
  } catch (err) {
    console.error("CHAVE LIST ERROR", err);
    return NextResponse.json({ message: "Erro interno" }, { status: 500 });
  }
}
