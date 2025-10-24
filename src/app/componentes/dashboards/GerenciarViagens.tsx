"use client";

import { useEffect, useState, FormEvent } from "react";
import styles from "../../dashboard/Dashboard.module.css";
import { IViagem } from "../../../lib/models/Viagem";
import { IVeiculo } from "../../../lib/models/Veiculo";
import { IUsuario } from "../../../lib/models/Usuario";

export default function GerenciarViagens() {
  // Listas
  const [viagens, setViagens] = useState<IViagem[]>([]);
  const [veiculos, setVeiculos] = useState<IVeiculo[]>([]);
  const [motoristas, setMotoristas] = useState<IUsuario[]>([]);

  // Formulário
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [dataAgendada, setDataAgendada] = useState("");
  const [idVeiculo, setIdVeiculo] = useState("");
  const [idMotorista, setIdMotorista] = useState("");

  // Estado da UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [viagensRes, veiculosRes, usuariosRes] = await Promise.all([
        fetch("/api/viagens", { cache: 'no-store' }),
        fetch("/api/veiculos", { cache: 'no-store' }),
        fetch("/api/usuarios", { cache: 'no-store' }),
      ]);

      const viagensData = await viagensRes.json();
      const veiculosData = await veiculosRes.json();
      const usuariosData = await usuariosRes.json();

      if (viagensData.success) setViagens(viagensData.data);
      if (veiculosData.success) setVeiculos(veiculosData.data);
      if (usuariosData.success) {
        setMotoristas(
          usuariosData.data.filter((u: IUsuario) => u.funcao === "Motorista")
        );
      }
    } catch (err) {
      setError("Falha ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!origem || !destino || !dataAgendada || !idVeiculo || !idMotorista) {
      setFormError("Todos os campos são obrigatórios.");
      return;
    }

    try {
      const response = await fetch("/api/viagens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origem,
          destino,
          dataAgendada: new Date(dataAgendada), // Garante o formato correto
          idVeiculo,
          idMotorista,
          status: "Agendada",
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Limpa o formulário e atualiza a lista
        setOrigem("");
        setDestino("");
        setDataAgendada("");
        setIdVeiculo("");
        setIdMotorista("");
        fetchData(); 
      } else {
        setFormError(data.error || "Erro ao criar viagem.");
      }
    } catch (err) {
      setFormError("Falha na comunicação com o servidor.");
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p className={styles.errorText}>{error}</p>;

  return (
    <div className={styles.content}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 className={styles.sectionTitle}>Adicionar Nova Viagem</h2>
        <form onSubmit={handleSubmit} className={styles.formLayout}>
            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label htmlFor="origem">Origem</label>
                    <input id="origem" type="text" value={origem} onChange={e => setOrigem(e.target.value)} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="destino">Destino</label>
                    <input id="destino" type="text" value={destino} onChange={e => setDestino(e.target.value)} className={styles.input} />
                </div>
            </div>
            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label htmlFor="dataAgendada">Data Agendada</label>
                    <input id="dataAgendada" type="datetime-local" value={dataAgendada} onChange={e => setDataAgendada(e.target.value)} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="idVeiculo">Veículo</label>
                    <select id="idVeiculo" value={idVeiculo} onChange={e => setIdVeiculo(e.target.value)} className={styles.input}>
                        <option value="">Selecione um veículo</option>
                        {veiculos.map(v => <option key={v._id} value={v._id}>{v.placa} - {v.modelo}</option>)}
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="idMotorista">Motorista</label>
                    <select id="idMotorista" value={idMotorista} onChange={e => setIdMotorista(e.target.value)} className={styles.input}>
                        <option value="">Selecione um motorista</option>
                        {motoristas.map(m => <option key={m._id} value={m._id}>{m.nome}</option>)}
                    </select>
                </div>
            </div>
            {formError && <p className={styles.errorText}>{formError}</p>}
            <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`}>Adicionar Viagem</button>
        </form>
      </div>

      <div>
        <h2 className={styles.sectionTitle}>Viagens Cadastradas</h2>
        <table className={styles.viagensTable}>
          <thead>
            <tr>
              <th>Origem</th>
              <th>Destino</th>
              <th>Motorista</th>
              <th>Veículo</th>
              <th>Status</th>
              <th>Data Agendada</th>
            </tr>
          </thead>
          <tbody>
            {viagens.map((viagem: any) => (
              <tr key={viagem._id}>
                <td>{viagem.origem}</td>
                <td>{viagem.destino}</td>
                <td>{viagem.idMotorista?.nome || 'N/A'}</td>
                <td>{viagem.idVeiculo?.placa || 'N/A'}</td>
                <td>{viagem.status}</td>
                <td>{new Date(viagem.dataAgendada).toLocaleString("pt-BR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
