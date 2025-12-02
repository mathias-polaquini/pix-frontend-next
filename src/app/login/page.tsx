"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    const parsed = loginSchema.safeParse({ email, senha });

    if (!parsed.success) {
      const mensagem = parsed.error.issues[0]?.message || "Erro de validação";
      setErro(mensagem);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.message || "Erro ao fazer login");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
    } catch (err) {
      console.log("LoginPage", err)
      setErro("Erro ao conectar ao servidor");
    } finally {
      setLoading(false);
    }
  }
  return (
    <main style={{ padding: 24, maxWidth: 400, margin: "0 auto" }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: "block", marginBottom: 12, width: "100%" }}
        />
        <input
          type="password"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={{ display: "block", marginBottom: 12, width: "100%" }}
        />
        {erro && (
          <div style={{ color: "red", marginBottom: 12 }}>
            {erro}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 8,
            background: "#333",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <div style={{ marginTop: 12 }}>
        <a href="/cadastro">Criar conta</a>
      </div>
    </main>
  );
}







