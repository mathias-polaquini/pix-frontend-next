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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  async function carregar(p: number = 1): Promise<void> {
    setLoading(true);
    try {
      const res = await fetch(`/api/transacoes/list?page=${p}&limit=5`);
      const data = await res.json();

      setLista(Array.isArray(data.transacoes) ? data.transacoes : []);
      setTotalPages(data.totalPages || 1);
      setPage(data.page || 1);
    } catch (err) {
      console.error("Erro ao carregar transações", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar(1);
  }, []);
  function nextPage(): void {
    if (page < totalPages) carregar(page + 1);
  }
  function prevPage(): void {
    if (page > 1) carregar(page - 1);
  }
  return (
    <main style={{ padding: 24 }}>
      <h1>Histórico de Transações</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : lista.length === 0 ? (
        <p>Nenhuma transação encontrada.</p>
      ) : (
        <div>
          {lista.map((t) => (
            <div
              key={t.id}
              style={{
                border: "1px solid #ddd",
                padding: 12,
                marginBottom: 12,
                borderRadius: 6,
              }}
            >
              <p>
                <strong>ID:</strong> {t.id}
              </p>
              <p>
                <strong>Origem:</strong> {t.chave_origem}
              </p>
              <p>
                <strong>Destino:</strong> {t.chave_destino}
              </p>
              <p>
                <strong>Valor:</strong> R$ {Number(t.valor).toFixed(2)}
              </p>
              <p>
                <strong>Data:</strong> {t.data_transferencia}
              </p>
              {t.mensagem && (
                <p>
                  <strong>Mensagem:</strong> {t.mensagem}
                </p>
              )}
            </div>
          ))}
          {}
          <div style={{ marginTop: 20 }}>
            <button
              onClick={prevPage}
              disabled={page <= 1}
              style={{
                padding: 8,
                marginRight: 12,
                background: "#333",
                color: "white",
                border: "none",
                cursor: "pointer",
                opacity: page <= 1 ? 0.5 : 1,
              }}
            >
              Página Anterior
            </button>
            <button
              onClick={nextPage}
              disabled={page >= totalPages}
              style={{
                padding: 8,
                background: "#333",
                color: "white",
                border: "none",
                cursor: "pointer",
                opacity: page >= totalPages ? 0.5 : 1,
              }}
            >
              Próxima Página
            </button>
            <div style={{ marginTop: 12 }}>
              Página {page} de {totalPages}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}





