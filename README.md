# 🚚 Sistema de Gerenciamento de Frotas (SGF) – LogiMax Transportes

## 🧾 Briefing

O SGF é uma aplicação web para centralizar e otimizar o controle de veículos, motoristas e viagens da LogiMax Transportes. O sistema digitaliza o processo antes feito em quadro branco, permitindo cadastro de veículos e motoristas, criação de viagens e acompanhamento de rotas e quilometragem.

---

## 🎯 Objetivo

- Gerenciar informações sobre veículos, motoristas e viagens.
- Controlar quais motoristas estão com quais veículos e para onde estão indo.
- Permitir atualização da quilometragem ao final de cada viagem.
- Emitir alertas de manutenção preventiva a cada 10.000 km rodados.
- Proteger o acesso ao sistema com autenticação e papéis de usuário (Gestor / Motorista).

---

## 👥 Público-Alvo

- **Gestor de Frota:** cadastra veículos e motoristas, cria viagens e monitora o uso da frota.
- **Motorista:** visualiza apenas as viagens atribuídas a ele e atualiza a quilometragem ao final.

---

## ⚙️ Requisitos

### Funcionais

- Cadastro e autenticação de usuários (Gestor/Motorista) com diferentes níveis de acesso.
- CRUD de veículos (placa, modelo, ano, kmAtual).
- CRUD de motoristas (nome, CNH, telefone).
- Controle de viagens (origem, destino, status, associação de motorista e veículo).
- Atualização de quilometragem ao finalizar viagem.
- Alertas de manutenção preventiva a cada 10.000 km.
- Dashboard de monitoramento.

### Não Funcionais

- Segurança com JWT e bcrypt.
- Interface simples e responsiva.
- Desempenho otimizado.
- Escalabilidade para futuras funcionalidades.

---

## 💾 Tecnologias

- **Frontend/Backend:** Next.js (React + App Router)
- **Linguagem:** TypeScript
- **Banco de Dados:** MongoDB (Mongoose)
- **Autenticação:** JWT + bcrypt
- **Estilos:** SCSS

---

## 🧩 Diagramas

### Diagrama de Classes

```
+------------------+        +------------------+        +------------------+
|    Motorista     |        |     Viagem       |        |     Veiculo      |
+------------------+        +------------------+        +------------------+
| id               |<------>| idMotorista      |        | id               |
| nome             |        | idVeiculo        |<------>| placa            |
| cnh              |        | origem           |        | modelo           |
| telefone         |        | destino          |        | ano              |
+------------------+        | status           |        | kmAtual          |
                            | dataInicio       |        | alertaManutencao |
                            | dataFim          |        +------------------+
                            | kmFinal          |
                            +------------------+
```

### Diagrama de Casos de Uso

```
Ator: Gestor de Frota
  ├─ Cadastrar/Editar/Excluir Veículos
  ├─ Cadastrar/Editar/Excluir Motoristas
  └─ Criar Viagem (associar motorista e veículo)

Ator: Motorista
  ├─ Visualizar Viagens atribuídas
  └─ Atualizar quilometragem ao finalizar

Ator: Sistema
  └─ Emitir alerta de manutenção
```

### Diagrama de Fluxo – Login

```
Usuário → [Tela de Login]
    ↓
[Insere e-mail/senha]
    ↓
[Sistema valida credenciais]
    ↓
┌───────────────┬───────────────┐
│ Credenciais   │ Credenciais   │
│ válidas       │ inválidas     │
├───────────────┼───────────────┤
│ Gera JWT      │ Exibe erro    │
│ Redireciona   │ Permanece     │
│ para dashboard│ na tela       │
└───────────────┴───────────────┘
```

---

## ⚖️ Análise de Risco

| Risco                           | Probabilidade | Impacto | Ação Preventiva                                  |
|----------------------------------|--------------|---------|--------------------------------------------------|
| Erros no cálculo de quilometragem| Média        | Alta    | Validar atualização de km no encerramento da viagem|
| Atrasos em alertas de manutenção | Baixa        | Média   | Implementar verificação automática no backend     |
| Falhas de login ou autenticação  | Média        | Alta    | Utilizar JWT com expiração e bcrypt seguro        |
| Dados inconsistentes de viagens  | Baixa        | Alta    | Regras de integridade entre motorista e veículo   |

---

## 🚀 Como rodar o projeto

1. **Clone o repositório**
2. **Instale as dependências**
   ```bash
   npm install
   ```
3. **Configure o arquivo `.env.local`** na raiz:
   ```
   MONGODB_URI=mongodb://localhost:27017/somativa-frotas
   JWT_SECRET=sua_chave_secreta_aqui
   ```
4. **Inicie o servidor**
   ```bash
   npm run dev
   ```

---

## 📈 Resultado Esperado

Com o SGF, a LogiMax Transportes poderá:
- Controlar digitalmente a alocação de motoristas e veículos;
- Acompanhar histórico de viagens e quilometragem;
- Evitar atrasos de manutenção com alertas automáticos;
- Garantir maior eficiência e segurança operacional da frota.

---
