"use client";

import { useEffect, useState } from "react";

type Transacao = {
  id: number;
  chave_origem: string;
  chave_destino: string;
  valor: number;
  mensagem?: string | null;
  data_transferencia: string;
};

export default function TransacoesPage() {
  const [lista, setLista] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);

  async function carregar(): Promise<void> {
    try {
      const res = await fetch("/api/transacoes/list");
      const data = await res.json();

      // garante que é array antes de setar
      setLista(Array.isArray(data.transacoes) ? data.transacoes : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  if (loading)
    return <p style={{ padding: 20 }}>Carregando...</p>;

  return (
    <main style={{ padding: 24 }}>
      <h1>Histórico de Transações</h1>

      {lista.length === 0 && <p>Nenhuma transação encontrada.</p>}

      {lista.map((t) => {
        const isEntrada = t.chave_destino;

        return (
          <div
            key={t.id}
            style={{
              border: "1px solid #ccc",
              marginBottom: 12,
              padding: 12,
              borderRadius: 8,
            }}
          >
            <p>
              <strong>ID:</strong> {t.id}
            </p>

            <p>
              <strong>Tipo:</strong>{" "}
              {isEntrada ? "Entrada (recebido)" : "Saída (enviado)"}
            </p>

            <p>
              <strong>Valor:</strong> R$ {Number(t.valor).toFixed(2)}
            </p>

            <p>
              <strong>Origem:</strong> {t.chave_origem}
            </p>

            <p>
              <strong>Destino:</strong> {t.chave_destino}
            </p>

            {t.mensagem && (
              <p>
                <strong>Mensagem:</strong> {t.mensagem}
              </p>
            )}

            <p>
              <strong>Data:</strong> {t.data_transferencia}
            </p>
          </div>
        );
      })}
    </main>
  );
}
