"use client";

import { useState } from "react";

export default function NovaTransacaoPage() {
  const [chaveOrigem, setChaveOrigem] = useState("");
  const [chaveDestino, setChaveDestino] = useState("");
  const [valor, setValor] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [resposta, setResposta] = useState("");

  async function enviarPix(e: React.FormEvent) {
    e.preventDefault();
    setResposta("");

    const body = {
      chave_origem: chaveOrigem,
      chave_destino: chaveDestino,
      valor: Number(valor),
      mensagem,
    };

    const res = await fetch("/api/transacoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      setResposta(data.message);
      return;
    }

    setResposta("PIX enviado!");
  }

  return (
    <main style={{ padding: 24, maxWidth: 450, margin: "0 auto" }}>
      <h1>Enviar PIX</h1>

      <form onSubmit={enviarPix}>
        <input
          type="text"
          placeholder="Chave Origem"
          value={chaveOrigem}
          onChange={(e) => setChaveOrigem(e.target.value)}
          style={{ width: "100%", marginBottom: 12 }}
        />

        <input
          type="text"
          placeholder="Chave Destino"
          value={chaveDestino}
          onChange={(e) => setChaveDestino(e.target.value)}
          style={{ width: "100%", marginBottom: 12 }}
        />

        <input
          type="number"
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          style={{ width: "100%", marginBottom: 12 }}
        />

        <input
          type="text"
          placeholder="Mensagem (opcional)"
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          style={{ width: "100%", marginBottom: 12 }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 10,
            background: "#333",
            color: "white",
          }}
        >
          Enviar PIX
        </button>

        {resposta && (
          <p style={{ color: "red", marginTop: 12 }}>{resposta}</p>
        )}
      </form>
    </main>
  );
}
