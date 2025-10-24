"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./login.module.css";
import Link from 'next/link';

 //interface do usuario

export default function LoginPage(){
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [error, setError] = useState("")

    const route = useRouter()

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        try {
            const response = await fetch(
                "/api/usuarios/login",
                {
                    method: "POST",
                    headers: {"Content-Type":"application/json"},
                    body: JSON.stringify({email, senha})
                }
            );
            const data = await response.json();
            if (data.success) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("funcao", data.usuario.funcao);
                route.push("/dashboard");
            }
            else{
                const errorData = data.error
                setError(errorData || "Falha ao fazer login")
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            setError("Erro de Servidor: "+error)
        }
    }
    return (
        <div className={styles.container}>
            <h1 className={styles.brandTitle}>Logimax Transportes</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2 className={styles.title}>Login</h2>
                {error && <p className={styles.error}>{error}</p>}
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                    id="email"
                    className={styles.input}
                    type="email" value={email} 
                    onChange={(e)=>setEmail(e.target.value)}
                    required
                    />
                </div>
                <div>
                    <label htmlFor="senha">Senha</label>
                    <input
                    id="senha"
                    className={styles.input}
                    type="password" value={senha} 
                    onChange={(e)=>setSenha(e.target.value)}
                    required
                    />
                </div>

                <button type="submit" className={styles.button}>Entrar</button>

                <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                    Não tem uma conta?{" "}
                    <Link href="/registro" style={{ color: '#4299e1', fontWeight: '600', textDecoration: 'none' }}>
                        Crie uma
                    </Link>
                </p>
            </form>
        </div>
    )
}