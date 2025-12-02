"use client";

import { useEffect, useState } from "react";

type ChaveType = {
  chave: string;
  tipo: string;
};

export default function EnviarPix() {
  const [origens, setOrigens] = useState<string[]>([]);
  const [destino, setDestino] = useState("");
  const [origem, setOrigem] = useState("");
  const [valor, setValor] = useState("");
  const [msg, setMsg] = useState("");
  const [resposta, setResposta] = useState("");
  const [loading, setLoading] = useState(false);

  // ==============================
  // CARREGAR CHAVES DENTRO DO EFEITO
  // ==============================
  useEffect(() => {
    async function fetchOrigens() {
      try {
        const res = await fetch("/api/chaves/list");
        const data: ChaveType[] = await res.json();
        setOrigens(data.map((c) => c.chave));
      } catch (err) {
        console.error(err);
      }
    }

    fetchOrigens();
  }, []);

  // ==============================
  // ENVIAR PIX
  // ==============================
  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setResposta("");
    setLoading(true);

    const body = {
      chave_origem: origem,
      chave_destino: destino,
      valor: Number(valor),
      mensagem: msg,
    };

    try {
      const res = await fetch("/api/transacoes/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      setResposta(data.message);
    } catch (err) {
      setResposta("Erro ao enviar PIX");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 450, margin: "0 auto" }}>
      <h1>Enviar PIX</h1>

      <form onSubmit={enviar}>
        <label>Chave de Origem</label>
        <select
          value={origem}
          onChange={(e) => setOrigem(e.target.value)}
          style={{ width: "100%", marginBottom: 12 }}
        >
          <option value="">Selecione</option>
          {origens.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label>Chave de Destino</label>
        <input
          type="text"
          value={destino}
          onChange={(e) => setDestino(e.target.value)}
          placeholder="Digite a chave PIX destino"
          style={{ width: "100%", marginBottom: 12 }}
        />

        <label>Valor (R$)</label>
        <input
          type="number"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="0.00"
          style={{ width: "100%", marginBottom: 12 }}
        />

        <label>Mensagem (opcional)</label>
        <input
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Mensagem"
          style={{ width: "100%", marginBottom: 12 }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 12,
            background: "#333",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Enviando..." : "Enviar PIX"}
        </button>

        {resposta && (
          <p style={{ marginTop: 16, color: "green" }}>{resposta}</p>
        )}
      </form>
    </main>
  );
}
