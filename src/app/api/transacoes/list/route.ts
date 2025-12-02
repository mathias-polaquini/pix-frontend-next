import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const match = cookie.split(";").find((c) => c.trim().startsWith("token="));
    if (!match) {
      return NextResponse.json(
        { message: "Não autenticado" },
        { status: 401 }
      );
    }
    const token = match.replace("token=", "");
    
    const decoded = verifyToken(token, process.env.JWT_SECRET!);
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") || 1);
    const limit = Number(url.searchParams.get("limit") || 5);
    const [items, count] = await Promise.all([
      prisma.transacao.findMany({
        where: { usuarioId: decoded.sub },
        skip: (page - 1) * limit,

        take: limit,
        orderBy: { id: "desc" },
      }),
      prisma.transacao.count({
        where: { usuarioId: decoded.sub },
      }),
    ]);
    return NextResponse.json({
      transacoes: items,
      totalPages: Math.ceil(count / limit),
      page,
    });

  } catch (err) {
    console.error("TRANSACAO LIST ERROR", err);
    return NextResponse.json({ message: "Erro interno" }, { status: 500 });
  }
}




