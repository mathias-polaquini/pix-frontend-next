import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt"; // usando seu helper

export const runtime = "nodejs";

type CreatePixBody = {
  chave_origem: string;
  chave_destino: string;
  valor: number;
  mensagem?: string;
};
export async function POST(req: Request) {
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
    const body: CreatePixBody = await req.json();
    const { chave_origem, chave_destino, valor, mensagem } = body;
    if (!chave_origem || !chave_destino || !valor) {
      return NextResponse.json(
        { message: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }
    if (chave_origem === chave_destino) {
      return NextResponse.json(
        { message: "Não pode enviar para si mesmo" },
        { status: 400 }
      );
    }
    const origem = await prisma.chave.findFirst({
      where: {
        chave: chave_origem,
        usuarioId: decoded.sub,
      },
    });
    if (!origem) {
      return NextResponse.json(

        { message: "Chave de origem inválida" },
        { status: 404 }
      );
    }
    const destino = await prisma.chave.findUnique({
      where: { chave: chave_destino },
    });
    if (!destino) {
      return NextResponse.json(
        { message: "Chave de destino não encontrada" },
        { status: 404 }

      );
    }
    const nova = await prisma.transacao.create({
      data: {
        chaveOrigem: chave_origem,
        chaveDestino: chave_destino,
        valor,
        mensagem: mensagem || null,
        usuarioId: decoded.sub,
      },
    });
    return NextResponse.json({
      ok: true,

      message: "PIX enviado com sucesso!",
      transacao: nova,
    });
  } catch (err) {
    console.error("TRANSACAO CREATE ERROR", err);
    return NextResponse.json({ message: "Erro interno" }, { status: 500 });
  }
}



