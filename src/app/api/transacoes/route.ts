import { NextResponse } from "next/server";
import { AppDataSource } from "@/lib/data-source";
import { Transacao } from "@/entities/Transacao";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
export const runtime = "nodejs";
type JWTPayload = {
  sub: number;
  email: string;
  name: string;
  iat: number;
  exp: number;
};
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
export async function GET() {
  try {
    const token = cookies().get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Não autenticado" },
        { status: 401 }
      );
    }
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as JWTPayload;
    const userId = decoded.sub;
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    const repo = AppDataSource.getRepository(Transacao);
    const transacoes = await repo.find({
      where: { usuario: { id: userId } },
      relations: ["origem", "destino", "usuario"],
      order: { id: "DESC" },
    });
    return NextResponse.json({ transacoes });
  } catch (err) {
    console.error("LIST ERROR:", err);
    return NextResponse.json(
      { message: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
