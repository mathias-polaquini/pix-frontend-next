"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  nome: z.string().min(3, "Nome muito curto"),
  cpf_cnpj: z.string().min(11, "CPF/CNPJ inválido"),
  telefone: z.string().optional(),
  rua: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  numero_conta: z.string().regex(/^\d+$/, "Conta deve ser numérica"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  confirm: z.string(),
}).refine(d => d.password === d.confirm, {
  message: "As senhas não coincidem",
  path: ["confirm"],
});
export default function CadastroUsuario() {
  const router = useRouter();

  const [form, setForm] = useState({
    nome: "",
    cpf_cnpj: "",
    telefone: "",
    rua: "",
    bairro: "",
    cidade: "",
    numero_conta: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setLoading(true);
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setErro(parsed.error.issues[0].message);
      setLoading(false);
      return;
    }
    const payload = {
      ...parsed.data,
      numero_conta: Number(parsed.data.numero_conta),
    };
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.message || "Erro ao cadastrar");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
    } catch (err) {
      console.log("CadastroUsuario", err)
      setErro("Erro ao conectar ao servidor");
    } finally {
      setLoading(false);
    }
  }
  return (
    <main style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <h1>Cadastro de Usuário</h1>
      <form onSubmit={handleSubmit}>
        <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} />
        <input name="cpf_cnpj" placeholder="CPF/CNPJ" value={form.cpf_cnpj} onChange={handleChange} />
        <input name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} />
        <input name="rua" placeholder="Rua" value={form.rua} onChange={handleChange} />
        <input name="bairro" placeholder="Bairro" value={form.bairro} onChange={handleChange} />
        <input name="cidade" placeholder="Cidade" value={form.cidade} onChange={handleChange} />
        <input name="numero_conta" placeholder="Número da conta" value={form.numero_conta} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Senha" value={form.password} onChange={handleChange} />
        <input name="confirm" type="password" placeholder="Confirmar senha" value={form.confirm} onChange={handleChange} />
        {erro && <p style={{ color: "red", marginTop: 10 }}>{erro}</p>}
        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: 12 }}
        >
          {loading ? "Enviando..." : "Cadastrar"}
        </button>
      </form>
    </main>
  );
}





