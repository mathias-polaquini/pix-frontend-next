import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { email, senha } = await req.json();

    if (!email || !senha)
      return NextResponse.json(
        { message: "Email e senha obrigatórios" },
        { status: 400 }
      );

    const user = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!user)
      return NextResponse.json(
        { message: "Usuário não encontrado" },
        { status: 401 }
      );

    const ok = await bcrypt.compare(senha, user.senha);

    if (!ok)
      return NextResponse.json(
        { message: "Senha incorreta" },
        { status: 401 }
      );

    const token = jwt.sign(
      { sub: user.id, name: user.nome, email: user.email },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "1h" }
    );

    const res = NextResponse.json({ ok: true });

    res.headers.set(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600`
    );

    return res;
  } catch (err) {
    console.error("LOGIN ERROR", err);
    return NextResponse.json({ message: "Erro interno" }, { status: 500 });
  }
}
