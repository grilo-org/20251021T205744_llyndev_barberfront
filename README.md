<div align="center">

# 💈 BarberFront - Sistema de Barbearia

*Sistema web moderno para gerenciamento completo de barbearias*

**Desenvolvido com Next.js 14, TypeScript e Tailwind CSS**

---

</div>

## 🚀 Funcionalidades

<table>
<tr>
<td width="33%">

### 👤 Para Clientes
- ✅ Cadastro e autenticação
- ✅ Agendamento online  
- ✅ Visualizar agendamentos
- ✅ Editar perfil pessoal
- ✅ Sistema de notificações

</td>
<td width="33%">

### ✂️ Para Barbeiros  
- ✅ Painel de agendamentos
- ✅ Controle de status
- ✅ Agenda diária/semanal
- ✅ Gerenciar clientes
- ✅ Histórico de serviços

</td>
<td width="33%">

### 🔧 Para Administradores
- ✅ Gerenciar usuários
- ✅ CRUD de serviços  
- ✅ Configurar horários
- ✅ Controlar datas especiais
- ✅ Relatórios do sistema

</td>
</tr>
</table>

## 🛠️ Tech Stack

<div align="center">

| **Categoria** | **Tecnologia** | **Versão** |
|:-------------:|:--------------:|:----------:|
| **Framework** | Next.js | 14.x |
| **Linguagem** | TypeScript | 5.x |
| **Estilização** | Tailwind CSS | 3.x |
| **Componentes** | shadcn/ui | Latest |
| **Estado** | React Context | - |
| **HTTP** | Axios | Latest |
| **Ícones** | Lucide React | Latest |
| **Datas** | date-fns | Latest |

</div>

## 📋 Pré-requisitos

<div align="center">

| **Requisito** | **Versão Mínima** | **Status** |
|:-------------:|:----------------:|:---------:|
| Node.js | 18.0+ | ✅ |
| npm | 8.0+ | ✅ |
| Backend API | Spring Boot | ✅ Recomendado |

</div>

---

## 🚀 Instalação e Configuração

<details>
<summary><b>📥 1. Clone o repositório</b></summary>

```bash
git clone https://github.com/llyndev/barberfront.git
cd barberfront
```

</details>

<details>
<summary><b>📦 2. Instale as dependências</b></summary>

```bash
npm install
```

</details>

<details>
<summary><b>⚙️ 3. Configure as variáveis de ambiente</b></summary>

Crie um arquivo `.env.local` na raiz do projeto:

```env
# URL do backend
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

# Nome da aplicação (opcional)
NEXT_PUBLIC_APP_NAME="Barbearia Elite"
```

</details>

<details>
<summary><b>🏃 4. Execute o projeto</b></summary>

```bash
# Desenvolvimento
npm run dev
```

**🌐 Aplicação disponível em:** `http://localhost:3000`

</details>

---

## 🔧 Integração com Backend

> Este frontend foi projetado para funcionar com o backend oficial:
> **[Barber - Backend Spring Boot](https://github.com/llyndev/barber)**

<div align="center">

### 📋 Configuração Necessária

| **Item** | **Configuração** | **Valor** |
|:--------:|:---------------:|:---------:|
| **Porta** | Backend Spring Boot | `8080` |
| **CORS** | Origem permitida | `http://localhost:3000` |
| **Auth** | Tipo de Token | `JWT Bearer` |
| **Content-Type** | Headers HTTP | `application/json` |

</div>

<details>
<summary><b>🔌 Endpoints da API</b></summary>

#### 🔐 Autenticação
```http
POST /auth/login          # Login de usuários
POST /register            # Cadastro de novos usuários
GET  /auth/me            # Dados do usuário logado
```

#### 👥 Usuários  
```http
GET    /users             # Listar usuários (admin)
GET    /users/baber       # Listar os barbeiros
POST   /users             # Criar usuário (admin)
PUT    /users/{id}        # Atualizar usuário (admin)
DELETE /users/{id}        # Deletar usuário (admin)
PATCH  /users/{id}   # Alterar role do usuário
```

#### ✂️ Serviços
```http
GET    /services         # Listar serviços
POST   /services         # Criar serviço (admin)
PUT    /services/{id}    # Atualizar serviço (admin)  
DELETE /services/{id}    # Deletar serviço (admin)
```

#### 📅 Agendamentos
```http
GET   /scheduling                    # Listar agendamentos
POST /scheduling                    # Criar agendamento
PUT  /scheduling/completed/{id}     # Finalizar atendimento
DELETE /scheduling/{id}             # Cancelar agendamento
POST /scheduling/barber/{id}        # Cancelar com motivo (barbeiro)
```

#### ⏰ Horários de Funcionamento
```http
GET  /opening-hours/weekly-schedule          # Listar horários semanais
POST /opening-hours/weekly-schedule          # Criar/atualizar horário
GET  /opening-hours/specific-date         # Listar datas específicas  
POST /opening-hours/specific-date         # Criar data específica
PUT  /opening-hours/specific-date/{id}    # Atualizar data específica
DELETE /opening-hours/specific-date/{id}  # Deletar data específica
```

</details>

<details>
<summary><b>📊 Formato de Dados (TypeScript)</b></summary>

```typescript
// Usuário
interface User {
  id: number
  name: string
  email: string
  telephone: string
  role: "ADMIN" | "BARBER" | "CLIENT"
}

// Serviço
interface Service {
  id: number
  nameService: string
  description: string
  price: number
  durationInMinutes: number
}

// Agendamento
interface Scheduling {
  id: number
  dateTime: string // ISO date
  status: "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELED"
  paymentMethod: "MONEY" | "CREDIT" | "DEBIT" | "PIX" | "TRANSFER"
  clientId: number
  barberId: number
  serviceId: number
}
```

</details>

### Formato de Dados Esperados

#### Usuário
```typescript
{
  id: number
  name: string
  email: string
  telephone: string
  role: "ADMIN" | "BARBER" | "CLIENT"
}
```

#### Serviço
```typescript
{
  id: number
  nameService: string
  description: string
  price: number
  durationInMinutes: number
}
```

#### Agendamento
```typescript
{
  id: number
  dateTime: string // ISO date
  status: "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELED"
  paymentMethod: "MONEY" | "CREDIT" | "DEBIT" | "PIX" | "TRANSFER"
  clientId: number
  barberId: number
  serviceId: number
}
```

### Headers HTTP Necessários
O frontend envia automaticamente:
```
Content-Type: application/json
Authorization: Bearer <token> // quando logado
```

---

## 👥 Controle de Acesso

<table align="center">
<tr>
<th>👤 CLIENT</th>
<th>✂️ BARBER</th>
<th>🔧 ADMIN</th>
</tr>
<tr>
<td>

- ✅ Agendar serviços
- ✅ Ver agendamentos
- ✅ Editar perfil
- ❌ Painel barbeiro
- ❌ Área admin

</td>
<td>

- ✅ Painel agendamentos
- ✅ Gerenciar clientes
- ✅ Status atendimentos
- ✅ Editar perfil
- ❌ Área admin

</td>
<td>

- ✅ **Acesso Total**
- ✅ Gerenciar usuários
- ✅ CRUD serviços
- ✅ Config. horários
- ✅ Relatórios

</td>
</tr>
</table>

## 🧪 Scripts Disponíveis

<div align="center">

| **Script** | **Comando** | **Descrição** |
|:----------:|:-----------:|:-------------|
| **Dev** | `npm dev` | Servidor de desenvolvimento |
| **Build** | `npm build` | Build otimizado |
| **Start** | `npm start` | Servidor de produção |
| **Lint** | `npm lint` | Verificar código |
| **Type Check** | `npm type-check` | Verificar tipos TS |

</div>

---

## 🐛 Roadmap & Issues

<details>
<summary><b>🚧 Em Desenvolvimento</b></summary>

- [ ] 📷 Sistema de upload de imagens
- [ ] 🔔 Notificações push em tempo real
- [ ] 📊 Dashboard com relatórios avançados

</details>

<details>
<summary><b>💡 Ideias Futuras</b></summary>

- [ ] 🤖 Chatbot para agendamentos
- [ ] 📧 Email marketing integrado
- [ ] 🎯 Sistema de fidelidade
- [ ] 📝 Avaliações e comentários
- [ ] 📱 App móvel React Native

</details>
