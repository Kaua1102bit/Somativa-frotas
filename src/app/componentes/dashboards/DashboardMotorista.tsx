// app/componentes/dashboards/DashboardMotorista.tsx
"use client";

import { IViagem } from "../../../lib/models/Viagem";
import { IVeiculo } from "../../../lib/models/Veiculo";
import { useEffect, useState, FormEvent } from "react";
import { jwtDecode } from "jwt-decode";
import styles from "../../dashboard/Dashboard.module.css";

interface TokenPayload {
  id: string;
  nome: string;
  funcao: string;
}

export default function DashboardMotorista() {
  const [viagens, setViagens] = useState<IViagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [motoristaId, setMotoristaId] = useState<string | null>(null);

  const [viagemSelecionada, setViagemSelecionada] = useState<IViagem | null>(
    null
  );
  const [kmAtualInput, setKmAtualInput] = useState("");
  const [kmError, setKmError] = useState("");
  const [veiculoDaViagem, setVeiculoDaViagem] = useState<IVeiculo | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded: TokenPayload = jwtDecode(token);
      setMotoristaId(decoded.id);
      fetchViagens(decoded.id);
    }
  }, []);

  const fetchViagens = async (idMotorista: string) => {
    try {
      setLoading(true);
      const resposta = await fetch("/api/viagens");
      const data = await resposta.json();
      if (data.success) {
        const minhasViagens = data.data.filter(
          (viagem: any) => viagem.idMotorista?._id === idMotorista
        );
        setViagens(minhasViagens);
      } else {
        setError(data.error || "Erro ao buscar viagens.");
      }
    } catch (error) {
      console.error(error);
      setError("Erro de conexão ao buscar viagens.");
    } finally {
      setLoading(false);
    }
  };

  const handleIniciarViagem = async (viagemId: string) => {
    try {
      const res = await fetch(`/api/viagens/${viagemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Em Curso",
          dataInicio: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      if (data.success && motoristaId) {
        fetchViagens(motoristaId);
      }
    } catch (error) {
      console.error("Erro ao iniciar viagem:", error);
    }
  };

  const handleAbrirModalFinalizar = async (viagem: IViagem) => {
    try {
      const res = await fetch(`/api/veiculos/${viagem.idVeiculo.toString()}`);
      const data = await res.json();
      if (data.success) {
        setVeiculoDaViagem(data.data);
        setKmAtualInput(data.data.kmAtual.toString());
        setViagemSelecionada(viagem);
        setKmError("");
      }
    } catch (error) {
      setKmError("Erro ao buscar dados do veículo.");
    }
  };

  const handleFinalizarViagemSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!viagemSelecionada || !veiculoDaViagem) return;

    const novaKm = parseFloat(kmAtualInput);
    if (isNaN(novaKm) || novaKm < veiculoDaViagem.kmAtual) {
      setKmError(
        `KM inválido. Deve ser um número maior ou igual a ${veiculoDaViagem.kmAtual}.`
      );
      return;
    }

    try {
      const resVeiculo = await fetch(`/api/veiculos/${veiculoDaViagem._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kmAtual: novaKm }),
      });
      const dataVeiculo = await resVeiculo.json();
      if (!dataVeiculo.success) throw new Error("Falha ao atualizar veículo.");

      const resViagem = await fetch(`/api/viagens/${viagemSelecionada._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Finalizada",
          dataFim: new Date().toISOString(),
        }),
      });
      const dataViagem = await resViagem.json();
      if (!dataViagem.success) throw new Error("Falha ao finalizar viagem.");

      setViagemSelecionada(null);
      if (motoristaId) fetchViagens(motoristaId);
    } catch (error: any) {
      console.error(error);
      setKmError(error.message || "Erro ao salvar dados.");
    }
  };

  if (loading) return <p>Carregando minhas viagens...</p>;
  if (error) return <p className={styles.errorText}>{error}</p>;

  return (
    <div className={styles.content}>
      <h2 className={styles.sectionTitle}>Minhas Viagens</h2>
      <table className={styles.viagensTable}>
        <thead>
          <tr>
            <th>Origem</th>
            <th>Destino</th>
            <th>Veículo</th>
            <th>Status</th>
            <th>Agendada para</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {viagens.map((viagem: any) => (
            <tr key={viagem._id}>
              <td>{viagem.origem}</td>
              <td>{viagem.destino}</td>
              <td>
                {viagem.idVeiculo?.placa} ({viagem.idVeiculo?.modelo})
              </td>
              <td>{viagem.status}</td>
              <td>{new Date(viagem.dataAgendada).toLocaleString("pt-BR")}</td>
              <td className={styles.actions}>
                {viagem.status === "Agendada" && (
                  <button onClick={() => handleIniciarViagem(viagem._id)}>
                    Iniciar
                  </button>
                )}
                {viagem.status === "Em Curso" && (
                  <button onClick={() => handleAbrirModalFinalizar(viagem)}>
                    Finalizar
                  </button>
                )}
                {viagem.status === "Finalizada" && <span>Concluída</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {viagemSelecionada && veiculoDaViagem && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <form onSubmit={handleFinalizarViagemSubmit}>
              <div className={styles.modalHeader}>
                 <h4 className={styles.modalTitle}>
                    Finalizar Viagem: {viagemSelecionada.origem} p/{" "}
                    {viagemSelecionada.destino}
                 </h4>
              </div>
              <div className={styles.modalBody}>
                <p>
                  Veículo: {veiculoDaViagem.placa} ({veiculoDaViagem.modelo})
                </p>
                <p>KM anterior: {veiculoDaViagem.kmAtual} km</p>
                <div>
                  <label htmlFor="kmAtual">KM Atualizado (no painel):</label>
                  <input
                    type="number"
                    id="kmAtual"
                    className={styles.input}
                    value={kmAtualInput}
                    onChange={(e) => setKmAtualInput(e.target.value)}
                    min={veiculoDaViagem.kmAtual}
                    required
                  />
                </div>
                {kmError && <p className={styles.errorText}>{kmError}</p>}
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={`${styles.button} ${styles.buttonSecondary}`} onClick={() => setViagemSelecionada(null)}>
                  Cancelar
                </button>
                <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`}>
                  Confirmar Finalização
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
