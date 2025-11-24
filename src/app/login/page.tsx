'use client';

import { useState } from "react";
import {login} from "@/services/auth";
import Input from from "@/components/ui/Input";
import Button from "components/ui/Button";
import { useRouter } from "next/navigation";

export default function LoginPage(){
  const[email,setEmail] = useState("");
  const[senha,setSenha] = useState("");
  const[loading, setLoading] = useState(false);
  const[erro,setErro] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e:React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try{
      const result = await login({email,senha});
      console.log("resultado Login ",result);
      router.push("/dashboard");
    }catch(err:any){
      setErro(err?.message || "Erro ao logar");
    }finally{
      setLoading(false);
    }
  }

  return(
    <main>
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(v) => setEmail(v.target.value)}
          label="Email"
        />

        <input
          type="password"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(v) => setSenha(v.target.value)}
          label="Senha"
        />
        {erro && <div>{erro}</div>}

        <button type="submit" disabled={loading}>
          {loading? "Entrando...":"Entrar"}
        </button>

      </form>
    </main>
  )
}
