"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, senha })
      });

      const data = await res.json();
      if (!res.ok) {
        setErro(data?.message || "Erro ao logar");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setErro("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <form onSubmit={handleSubmit} style={{ width: 320, padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
        <h2>Login</h2>

        <label htmlFor="email">Email</label>
        <input id="email" value={email} onChange={(e)=>setEmail(e.target.value)} />

        <label htmlFor="senha">Senha</label>
        <input id="senha" type="password" value={senha} onChange={(e)=>setSenha(e.target.value)} />

        {erro && <div style={{ color: "crimson" }}>{erro}</div>}

        <button type="submit" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
      </form>
    </main>
  );
}
