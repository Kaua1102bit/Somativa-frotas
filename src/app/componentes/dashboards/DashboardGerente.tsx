"use client";

import { IUsuario } from "../../../lib/models/Usuario";
import styles from "../../dashboard/Dashboard.module.css";
import { IVeiculo } from "../../../lib/models/Veiculo";
import { useEffect, useState, FormEvent } from "react";
import GerenciarViagens from "./GerenciarViagens";

type View = "VIAGENS" | "VEICULOS" | "MOTORISTAS" | "ALERTAS";

interface DashboardGestorProps {
  initialView?: View;
}

export default function DashboardGestor({ initialView = "ALERTAS" }: DashboardGestorProps) {
  const [view, setView] = useState<View>(initialView);

  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [veiculos, setVeiculos] = useState<IVeiculo[]>([]);
  const [alertas, setAlertas] = useState<IVeiculo[]>([]);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [funcao, setFuncao] = useState("Motorista");
  const [placa, setPlaca] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState(new Date().getFullYear());
  const [kmAtual, setKmAtual] = useState(0);

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    // Busca os dados relevantes para a aba selecionada.
    // A aba "VIAGENS" busca seus próprios dados internamente.
    if (view === "MOTORISTAS") {
      fetchUsuarios();
    } else if (view === "VEICULOS") {
      fetchVeiculos();
    } else if (view === "ALERTAS") {
      // A aba de Alertas depende da lista de veículos.
      fetchVeiculos();
    }
  }, [view]);

  useEffect(() => {
    const veiculosEmAlerta = veiculos.filter(
      (v) => v.kmAtual - v.kmUltimaManutencao >= 10000
    );
    setAlertas(veiculosEmAlerta);
  }, [veiculos]);

  const fetchUsuarios = async () => {
    try {
      const resposta = await fetch("/api/usuarios", { cache: 'no-store' });
      const data = await resposta.json();
      if (data.success) setUsuarios(data.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };
  const fetchVeiculos = async () => {
    try {
      const resposta = await fetch("/api/veiculos", { cache: 'no-store' });
      const data = await resposta.json();
      if (data.success) setVeiculos(data.data);
    } catch (error) {
      console.error("Erro ao buscar veículos:", error);
    }
  };

  const handleCadastroMotoristaSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    try {
      const resposta = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha, funcao }),
      });
      const data = await resposta.json();
      if (data.success) {
        setFormSuccess("Motorista cadastrado com sucesso!");
        setNome("");
        setEmail("");
        setSenha("");
        fetchUsuarios();
      } else {
        setFormError(data.error || "Erro ao cadastrar motorista.");
      }
    } catch (error) {
      setFormError("Ocorreu um erro no servidor.");
    }
  };

  const handleCadastroVeiculoSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    try {
      const resposta = await fetch("/api/veiculos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placa,
          modelo,
          ano,
          kmAtual,
          kmUltimaManutencao: kmAtual,
        }),
      });
      const data = await resposta.json();
      if (data.success) {
        setFormSuccess("Veículo cadastrado com sucesso!");
        setPlaca("");
        setModelo("");
        setAno(new Date().getFullYear());
        setKmAtual(0);
        fetchVeiculos();
      } else {
        setFormError(data.error || "Erro ao cadastrar veículo.");
      }
    } catch (error) {
      setFormError("Ocorreu um erro no servidor.");
    }
  };

  const handleRegistrarManutencao = async (veiculo: IVeiculo) => {
    if (
      !confirm(
        `Confirmar manutenção do veículo ${veiculo.placa}? \nO KM da última manutenção será atualizado para ${veiculo.kmAtual} km.`
      )
    )
      return;

    try {
      const res = await fetch(`/api/veiculos/${veiculo._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kmUltimaManutencao: veiculo.kmAtual }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Manutenção registrada!");
        fetchVeiculos();
      } else {
        alert("Erro ao registrar manutenção.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro de servidor ao registrar manutenção.");
    }
  };

  const renderView = () => {
    switch (view) {
      case "ALERTAS":
        return (
          <div>
            <h3>Alertas de Manutenção (Diferencial)</h3>
            <p>Veículos que precisam de manutenção (a cada 10.000 km).</p>
            {alertas.length === 0 ? (
              <p>Nenhum veículo precisa de manutenção.</p>
            ) : (
              <table className={styles.viagensTable}>
                <thead>
                  <tr>
                    <th>Placa</th>
                    <th>Modelo</th>
                    <th>KM Atual</th>
                    <th>KM Últ. Manutenção</th>
                    <th>KM desde Manut.</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {alertas.map((v) => (
                    <tr key={v._id} style={{ backgroundColor: "#ffcccc" }}>
                      <td>{v.placa}</td>
                      <td>{v.modelo}</td>
                      <td>{v.kmAtual} km</td>
                      <td>{v.kmUltimaManutencao} km</td>
                      <td>{v.kmAtual - v.kmUltimaManutencao} km</td>
                      <td>
                        <button
                          onClick={() => handleRegistrarManutencao(v)}
                        >
                          Registrar Manutenção
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );

      case "VIAGENS":
        return <GerenciarViagens key={Date.now()} />;

      case "VEICULOS":
        return (
          <div>
            <h3 className={styles.sectionTitle}>Cadastrar Novo Veículo</h3>
            <form onSubmit={handleCadastroVeiculoSubmit} className={styles.formLayout}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="placa">Placa</label>
                  <input id="placa" type="text" value={placa} onChange={(e) => setPlaca(e.target.value)} required className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="modelo">Modelo</label>
                  <input id="modelo" type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} required className={styles.input} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="ano">Ano</label>
                  <input id="ano" type="number" value={ano} onChange={(e) => setAno(parseInt(e.target.value))} required className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="kmAtual">KM Atual</label>
                  <input id="kmAtual" type="number" value={kmAtual} onChange={(e) => setKmAtual(parseFloat(e.target.value))} required className={styles.input} />
                </div>
              </div>
              <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`}>Cadastrar Veículo</button>
            </form>

            <hr className={styles.hr} />

            <h3 className={styles.sectionTitle}>Frota de Veículos</h3>
            <table className={styles.viagensTable}>
              <thead>
                <tr>
                  <th>Placa</th>
                  <th>Modelo</th>
                  <th>Ano</th>
                  <th>KM Atual</th>
                  <th>KM Últ. Manutenção</th>
                </tr>
              </thead>
              <tbody>
                {veiculos.map((v) => (
                  <tr key={v._id}>
                    <td>{v.placa}</td>
                    <td>{v.modelo}</td>
                    <td>{v.ano}</td>
                    <td>{v.kmAtual}</td>
                    <td>{v.kmUltimaManutencao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "MOTORISTAS":
        return (
          <div>
            <h3 className={styles.sectionTitle}>Cadastrar Novo Usuário</h3>
            <form onSubmit={handleCadastroMotoristaSubmit} className={styles.formLayout}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="nome">Nome</label>
                  <input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} required className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={styles.input} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="senha">Senha</label>
                  <input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="funcao">Função</label>
                  <select id="funcao" value={funcao} onChange={(e) => setFuncao(e.target.value)} className={styles.input}>
                    <option value="Motorista">Motorista</option>
                    <option value="Gestor">Gestor</option>
                  </select>
                </div>
              </div>
              <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`}>Cadastrar Usuário</button>
            </form>

            <hr className={styles.hr} />

            <h3 className={styles.sectionTitle}>Usuários do Sistema</h3>
            <table className={styles.viagensTable}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Função</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario._id}>
                    <td>{usuario.nome}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.funcao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <nav
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          borderBottom: "2px solid #ccc",
          paddingBottom: "10px",
        }}
      >
        <button
          onClick={() => setView("ALERTAS")}
          style={view === "ALERTAS" ? activeTabStyle : tabStyle}
        >
          Alertas de Manutenção {alertas.length > 0 && `(${alertas.length})`}
        </button>
        <button
          onClick={() => setView("VIAGENS")}
          style={view === "VIAGENS" ? activeTabStyle : tabStyle}
        >
          Gerenciar Viagens
        </button>
        <button
          onClick={() => setView("VEICULOS")}
          style={view === "VEICULOS" ? activeTabStyle : tabStyle}
        >
          Gerenciar Veículos
        </button>
        <button
          onClick={() => setView("MOTORISTAS")}
          style={view === "MOTORISTAS" ? activeTabStyle : tabStyle}
        >
          Gerenciar Motoristas
        </button>
      </nav>

      {(formSuccess && <p style={{ color: "green" }}>{formSuccess}</p>) ||
        (formError && <p style={{ color: "red" }}>{formError}</p>)}

      {renderView()}
    </div>
  );
}

const tabStyle: React.CSSProperties = {
  padding: "10px",
  cursor: "pointer",
  border: "1px solid #ccc",
  background: "#f0f0f0",
};

const activeTabStyle: React.CSSProperties = {
  ...tabStyle,
  background: "#fff",
  borderBottom: "1px solid #fff",
};