"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./registro.module.css";
import Link from 'next/link';

export default function RegistroPage() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [nome, setNome] = useState("");
    const [error, setError] = useState("");

    const route = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("/api/usuarios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome, email, senha, funcao: 'Motorista' }), // Defaulting 'funcao' to Motorista
            });
            const data = await response.json();
            if (data.success) {
                alert("Conta criada com sucesso! Você será redirecionado para o login.");
                route.push("/login");
            } else {
                setError(data.error || "Falha ao criar conta");
            }
        } catch (error) {
            console.error("Erro ao criar conta:", error);
            setError("Erro de Servidor: " + error);
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2 className={styles.title}>Criar Conta</h2>
                {error && <p className={styles.error}>{error}</p>}
                <div>
                    <label htmlFor="nome">Nome</label>
                    <input
                        id="nome"
                        className={styles.input}
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        className={styles.input}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="senha">Senha</label>
                    <input
                        id="senha"
                        className={styles.input}
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className={styles.button}>
                    Registrar
                </button>

                <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                    Já tem uma conta?{' '}
                    <Link href="/login" style={{ color: '#4299e1', fontWeight: '600', textDecoration: 'none' }}>
                        Faça Login
                    </Link>
                </p>
            </form>
        </div>
    );
}
