"use client";

import { useEffect, useState } from "react";

type ChaveType = {
  chave: string;
  tipo: string;
};
export default function ChavesPage() {
  const [chaves, setChaves] = useState<ChaveType[]>([]);
  const [chave, setChave] = useState("");
  const [tipo, setTipo] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  async function carregar(): Promise<void> {
    try {
      const res = await fetch("/api/chaves/list");
      const data = await res.json();

      setChaves(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  async function criarChave(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/chaves/create", {
      method: "POST",
      body: JSON.stringify({ chave, tipo }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.message || "Erro ao criar chave");
      return;
    }
    setMsg("Chave criada!");
    setChave("");
    setTipo("");
    carregar();
  }
  async function remover(chaveDelete: string): Promise<void> {
    const res = await fetch("/api/chaves/delete", {
      method: "POST",
      body: JSON.stringify({ chave: chaveDelete }),
    });
    if (res.ok) carregar();
  }
  useEffect(() => {
    carregar();
  }, []);
  return (
    <main style={{ padding: 24 }}>
      <h1>Gerenciar Chaves PIX</h1>
      {/* FORM */}
      <form onSubmit={criarChave} style={{ marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Digite a chave"
          value={chave}
          onChange={(e) => setChave(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          style={{ marginRight: 10 }}
        >
          <option value="">Selecione o tipo</option>
          <option value="E">Email</option>
          <option value="T">Telefone</option>
          <option value="C">CPF/CNPJ</option>
          <option value="A">Aleatória</option>
        </select>

        <button type="submit">Criar</button>
      </form>

      {msg && <p style={{ color: "green" }}>{msg}</p>}
      {}
      <h3>Minhas chaves</h3>
      {loading ? (
        <p>Carregando...</p>
      ) : chaves.length === 0 ? (
        <p>Nenhuma chave encontrada.</p>
      ) : (
        <ul>
          {chaves.map((c) => (
            <li key={c.chave} style={{ marginBottom: 10 }}>
              <strong>{c.chave}</strong> ({c.tipo})
              <button
                onClick={() => remover(c.chave)}
                style={{ marginLeft: 10, cursor: "pointer" }}
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}








