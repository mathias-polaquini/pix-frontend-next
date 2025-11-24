// serviço de autenticação descartavel, logo mais vou adicionar o tolken JWT
type Credentials = { email: string; senha: string };

export async function login({ email, senha }: Credentials) {
  // Simula chamada a API com delay
  await new Promise((r) => setTimeout(r, 700));

  // validacao simples de exemplo
  if (!email || !senha) {
    throw new Error("Preencha email e senha");
  }

  if (email === "teste@teste.com" && senha === "123456") {
    return { ok: true, token: "token-mock-123" };
  }

  // aqui normalmente você faria fetch('/api/login', { method: 'POST', body: JSON.stringify(...)})
  throw new Error("Credenciais inválidas");
}
