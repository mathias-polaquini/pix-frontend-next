"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

// --- VALIDAÇÃO ---
const schema = z
  .object({
    cpf_cnpj: z.string().min(11, "CPF/CNPJ inválido"),
    nome: z.string().min(3, "Nome muito curto"),
    telefone: z.string().optional().nullable(),
    rua: z.string().optional().nullable(),
    bairro: z.string().optional().nullable(),
    cidade: z.string().optional().nullable(),
    numero_conta: z.string().regex(/^\d+$/, "Número da conta deve ser numérico"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha muito curta"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    path: ["confirm"],
    message: "As senhas não conferem",
  });

// Tipo inferido pelo Zod
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    cpf_cnpj: "",
    nome: "",
    telefone: "",
    rua: "",
    bairro: "",
    cidade: "",
    numero_conta: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const parsed = schema.safeParse(form);

    // --- CORREÇÃO DO ERRO DO ZOD ---
    if (!parsed.success) {
      const mensagem = parsed.error.issues[0]?.message || "Erro de validação";
      setError(mensagem);
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...parsed.data,
        numero_conta: Number(parsed.data.numero_conta),
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erro no cadastro");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setError("Erro ao conectar ao servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 640, margin: "0 auto" }}>
      <h1>Cadastro de Usuário</h1>

      <form onSubmit={handleSubmit}>
        <input name="cpf_cnpj" placeholder="CPF/CNPJ" value={form.cpf_cnpj} onChange={handleChange} />
        <input name="nome" placeholder="Nome completo" value={form.nome} onChange={handleChange} />
        <input name="telefone" placeholder="Telefone" value={form.telefone ?? ""} onChange={handleChange} />
        <input name="rua" placeholder="Rua" value={form.rua ?? ""} onChange={handleChange} />
        <input name="bairro" placeholder="Bairro" value={form.bairro ?? ""} onChange={handleChange} />
        <input name="cidade" placeholder="Cidade" value={form.cidade ?? ""} onChange={handleChange} />
        <input name="numero_conta" placeholder="Número da conta" value={form.numero_conta} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Senha" value={form.password} onChange={handleChange} />
        <input name="confirm" type="password" placeholder="Confirmar senha" value={form.confirm} onChange={handleChange} />

        {error && <div style={{ color: "red", marginTop: 12 }}>{error}</div>}

        <button type="submit" disabled={loading} style={{ marginTop: 12 }}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </main>
  );
}
