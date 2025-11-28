import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import LogoutButton from "./LogoutButton"; // <--- IMPORTANTE

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export default function DashboardPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  try {
    if (!token) throw new Error("No token");
    const payload = jwt.verify(token, JWT_SECRET) as any;

    return (
      <main style={{ padding: 24 }}>
        <h1>Dashboard</h1>
        <p>Bem-vindo, {payload.name} ({payload.email})</p>

        <LogoutButton />   {/* <-- AQUI ENTRA O BOTÃO */}
      </main>
    );
  } catch (err) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Dashboard</h1>
        <p>Usuário não autenticado.</p>
      </main>
    );
  }
}
