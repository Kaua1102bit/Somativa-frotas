"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import styles from "./Dashboard.module.css";

// Dashboards Reais
import DashboardMotorista from "../componentes/dashboards/DashboardMotorista";
import DashboardGestor from "../componentes/dashboards/DashboardGerente";
import GerenciarViagens from "../componentes/dashboards/GerenciarViagens";

interface TokenPayload {
  id: string;
  nome: string;
  funcao: string;
}

const menuMotorista = [
  { id: 'minhas-viagens', label: 'Minhas Viagens' },
];

const menuGestor = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'gerenciar-viagens', label: 'Gerenciar Viagens' },
  { id: 'gerenciar-veiculos', label: 'Gerenciar Veículos' },
  { id: 'gerenciar-motoristas', label: 'Gerenciar Motoristas' },
];

export default function DashboardPage() {
  const route = useRouter();
  const [userInfo, setUserInfo] = useState<TokenPayload | null>(null);
  const [activeScreen, setActiveScreen] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedFuncao = localStorage.getItem("funcao"); // Pega a função do cache

    if (!token) {
      route.push("/login");
    } else {
      const decoded: TokenPayload = jwtDecode(token);
      // Usa a função do cache ou a original do token
      const currentUserFuncao = storedFuncao || decoded.funcao;
      setUserInfo({ ...decoded, funcao: currentUserFuncao });

      if (currentUserFuncao.toLowerCase() === 'motorista') {
        setActiveScreen('minhas-viagens');
      } else if (currentUserFuncao.toLowerCase() === 'gestor') {
        setActiveScreen('dashboard');
      }
    }
  }, [route]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("funcao");
    route.push("/login");
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    if (userInfo) {
        localStorage.setItem('funcao', newRole);
        setUserInfo({ ...userInfo, funcao: newRole });

        if (newRole.toLowerCase() === 'motorista') {
            setActiveScreen('minhas-viagens');
        } else if (newRole.toLowerCase() === 'gestor') {
            setActiveScreen('dashboard');
        }
    }
  }

  const renderContent = () => {
    if (!userInfo) return null;
    switch (activeScreen) {
      case 'minhas-viagens':
        return <DashboardMotorista />;
      case 'dashboard':
        return <DashboardGestor />;
      case 'gerenciar-viagens':
        return <GerenciarViagens />;
      case 'gerenciar-veiculos':
        return <DashboardGestor key="veiculos" />;
      case 'gerenciar-motoristas':
        return <DashboardGestor key="motoristas" />;
      default:
        return <div className={styles.content}><h2 className={styles.sectionTitle}>Bem-vindo!</h2><p>Selecione uma opção no menu.</p></div>;
    }
  };

  const menuItems = userInfo?.funcao.toLowerCase() === 'gestor' ? menuGestor : menuMotorista;

  if (!userInfo) {
    return <p>Carregando...</p>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1 className={styles.brand}>LogiMax Transportes</h1>
        <div className={styles.headerControls}>
            <select className={styles.roleSwitcher} value={userInfo.funcao} onChange={handleRoleChange}>
                <option value="Motorista">Motorista</option>
                <option value="Gestor">Gestor</option>
            </select>
            <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
        </div>
      </header>
      <div className={styles.dashboardLayout}>
        <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
                <p className={styles.userName}>{userInfo.nome}</p>
                <p className={styles.userRole}>{userInfo.funcao}</p>
            </div>
            <nav>
                <ul className={styles.sidebarNav}>
                    {menuItems.map(item => (
                        <li key={item.id}>
                            <a 
                                href="#" 
                                className={`${styles.navLink} ${activeScreen === item.id ? styles.navLinkActive : ''}`}
                                onClick={(e) => {e.preventDefault(); setActiveScreen(item.id);}}
                            >
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
        <main className={styles.contentWrapper}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}