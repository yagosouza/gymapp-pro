# GymApp Pro

PWA de gestão de treinos de ginásio — crie planos de treino, registe exercícios, acompanhe o seu progresso e treine com um cronómetro de descanso integrado.

---

## Funcionalidades

- **Grupos Musculares** — crie e organize grupos (Peito, Costas, Pernas, etc.)
- **Exercícios** — biblioteca com grupos musculares, valores sugeridos, vídeo e imagem
- **Treinos** — planos reutilizáveis com exercícios, séries, reps, peso e descanso configuráveis
- **Modo Treino** — registe séries em tempo real, cronómetro de descanso com som e vibração, substitutos de exercícios
- **Histórico** — registo das sessões completadas
- **Frequência** — calendário semanal e mensal com dias de treino
- **Perfil e Medidas** — registo de peso, circunferências e 7 dobras cutâneas com histórico
- **IMC e Percentual de Gordura** — cálculo automático pela fórmula Jackson/Pollock 7 pontos
- **Importação por JSON** — importe treinos completos gerados por IA (prompt incluído na app)
- **PWA instalável** — funciona offline (assets em cache), instalável no iOS e Android
- **Dark mode** — interface exclusivamente escura, otimizada para ginásio

---

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Framework | React 19 |
| Roteamento | React Router v6 |
| Estilização | Tailwind CSS 3 |
| Backend | Firebase 11 (Firestore + Auth) |
| Ícones | Lucide React |
| Build | Create React App (react-scripts 5) |
| Testes | Jest + Testing Library |
| PWA | Workbox (via CRA) |
| Monitoramento | web-vitals |

---

## Pré-requisitos

- **Node.js** 18+
- **npm** 9+
- Conta [Firebase](https://firebase.google.com/) com projeto criado
- Firebase CLI (`npm install -g firebase-tools`) — apenas para deploy de regras

---

## Instalação

### 1. Clonar o repositório

```bash
git clone <url-do-repositório>
cd gymapp-pro
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie um ficheiro `.env.local` na raiz do projeto com as credenciais do seu projeto Firebase:

```
REACT_APP_API_KEY=AIza...
REACT_APP_AUTH_DOMAIN=seu-projeto.firebaseapp.com
REACT_APP_PROJECT_ID=seu-projeto
REACT_APP_STORAGE_BUCKET=seu-projeto.appspot.com
REACT_APP_MESSAGING_SENDER_ID=123456789
REACT_APP_APP_ID=1:123456789:web:abc123
REACT_APP_MEASUREMENT_ID=G-XXXXXXXXXX
```

> `REACT_APP_MEASUREMENT_ID` é opcional (apenas para Firebase Analytics).

### 4. Configurar regras de segurança do Firestore

```bash
firebase login
firebase use --add   # selecione o seu projeto
firebase deploy --only firestore:rules
```

> As regras estão em `firestore.rules` e garantem que cada utilizador só acede aos seus próprios dados.

### 5. Iniciar em desenvolvimento

```bash
npm start
```

A app abre em `http://localhost:3000`.

---

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm start` | Servidor de desenvolvimento com hot-reload |
| `npm test` | Executa os testes unitários |
| `npm run build` | Build de produção em `/build` |
| `npm run eject` | Ejeta a configuração do CRA (irreversível) |

---

## Estrutura do Projeto

```
src/
├── components/
│   ├── layout/          # Sidebar (desktop) e BottomNavBar (mobile)
│   ├── modals/          # Modais reutilizáveis (confirmação, histórico, vídeo, etc.)
│   ├── ui/              # Componentes base (InputField, Toast, LoadingOverlay, etc.)
│   ├── ErrorBoundary.js # PageErrorBoundary e AppErrorBoundary
│   └── GymApp.js        # Shell da app com Routes e layout
├── context/
│   ├── AppContext.js    # Estado global + listeners Firestore
│   └── ToastContext.js  # Sistema de notificações toast
├── firebase/
│   └── config.js        # Inicialização do Firebase
├── hooks/
│   └── useStickyState.js # Hook de persistência em localStorage
├── pages/
│   ├── auth/            # LoginPage
│   ├── exercises/       # ExerciseFormPage
│   ├── frequency/       # FrequencyPage
│   ├── groups/          # GroupFormPage
│   ├── import/          # ImportPage
│   ├── list/            # ListPageContainer (grupos e exercícios)
│   ├── profile/         # ProfilePage
│   ├── workouts/        # WorkoutsListPage, WorkoutEditorPage, TrainingModePage
│   └── HomePage.js
├── utils/
│   ├── calculations.js  # calculateBMI, calculateBodyFat (Jackson/Pollock)
│   └── __tests__/       # Testes unitários
└── constants/
    └── initialData.js   # Dados iniciais (grupos musculares, exercícios, perfil)
```

---

## Modelo de Dados (Firestore)

```
users/{userId}/
  profile/data           → documento único (nome, altura, idade, género, histórico de medidas)
  muscleGroups/          → coleção de grupos musculares
  exercises/             → coleção de exercícios com valores sugeridos e mídia
  workouts/              → coleção de planos de treino com exercícios aninhados
  history/               → coleção de sessões completadas (últimas 50, ordenadas por data)
```

---

## Rotas da Aplicação

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/` | HomePage | Dashboard com atalhos e frequência semanal |
| `/profile` | ProfilePage | Perfil e histórico de medidas |
| `/groups` | ListPageContainer | Lista de grupos musculares |
| `/groups/create` | GroupFormPage | Criar grupo |
| `/groups/edit/:id` | GroupFormPage | Editar grupo |
| `/exercises` | ListPageContainer | Lista de exercícios |
| `/exercises/create` | ExerciseFormPage | Criar exercício |
| `/exercises/edit/:id` | ExerciseFormPage | Editar exercício |
| `/workouts` | WorkoutsListPage | Lista de treinos |
| `/workouts/edit` | WorkoutEditorPage | Criar treino |
| `/workouts/edit/:id` | WorkoutEditorPage | Editar treino |
| `/workouts/training` | TrainingModePage | Sessão de treino activa |
| `/frequency` | FrequencyPage | Calendário de frequência |
| `/import` | ImportPage | Importar treinos via JSON |
| `/login` | LoginPage | Autenticação |

---

## Deploy

### Vercel

1. Importe o repositório no [Vercel](https://vercel.com/)
2. Defina as variáveis `REACT_APP_*` nas **Environment Variables** do projeto
3. O Vercel detecta automaticamente o CRA e faz o build

### Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

> Adicione `"rewrites": [{ "source": "**", "destination": "/index.html" }]` ao `firebase.json` para suporte a rotas SPA.

---

## Segurança

As regras do Firestore (`firestore.rules`) garantem que:
- Cada utilizador autenticado só lê e escreve os seus próprios dados
- Nenhum acesso é permitido a caminhos fora de `users/{userId}/`

Para deploy das regras: `firebase deploy --only firestore:rules`

---

## Licença

MIT
