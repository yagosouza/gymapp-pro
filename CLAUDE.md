# GymApp Pro — Contexto para Claude

## Projeto
PWA de treino de academia. React 19 + Firebase 11 (Auth + Firestore) + Tailwind CSS 3 (dark mode only).

**Repo:** https://github.com/yagosouza/gymapp-pro
**Deploy:** Vercel (auto-deploy via GitHub)
**Branch de trabalho:** `claude/trusting-poincare`
**Worktree:** `.claude/worktrees/trusting-poincare`

## Variáveis de ambiente
Ficheiro `.env.local` na raiz do worktree (copiado de `.env.development`). **Nunca commitar.**
Variáveis necessárias: `REACT_APP_API_KEY`, `REACT_APP_AUTH_DOMAIN`, `REACT_APP_PROJECT_ID`, `REACT_APP_STORAGE_BUCKET`, `REACT_APP_MESSAGING_SENDER_ID`, `REACT_APP_APP_ID`, `REACT_APP_MEASUREMENT_ID`.

## Arquitectura
```
src/
  index.js          # Root: AppErrorBoundary > BrowserRouter > ToastProvider > App
  App.js            # Auth guard (ProtectedRoute) + Routes /login e /*
  context/
    AppContext.js   # Estado global: muscleGroups, exercises, workouts, profile, history, activeSession
    ToastContext.js # showToast / showError / showSuccess
  components/
    GymApp.js       # Layout + Routes aninhadas (14 rotas)
    ErrorBoundary.js# PageErrorBoundary + AppErrorBoundary
    layout/         # Sidebar, BottomNavBar
    ui/             # Toast, LoadingOverlay, InputField, ...
    modals/         # ConfirmationModal, YouTubePlayerModal, ...
  pages/
    auth/           # LoginPage
    workouts/       # WorkoutsListPage, WorkoutEditorPage, TrainingModePage
    exercises/      # ExerciseFormPage
    groups/         # GroupFormPage
    list/           # ListPageContainer
    ...
  firebase/
    config.js       # initializeApp via REACT_APP_* env vars
  hooks/
    useStickyState.js # localStorage persistence
  utils/
    calculations.js   # calculateBMI, calculateBodyFat
```

## Rotas
| Path | Componente |
|------|-----------|
| `/login` | LoginPage |
| `/` | HomePage |
| `/profile` | ProfilePage |
| `/groups` | ListPageContainer |
| `/groups/create` | GroupFormPage |
| `/groups/edit/:id` | GroupFormPage |
| `/exercises` | ListPageContainer |
| `/exercises/create` | ExerciseFormPage |
| `/exercises/edit/:id` | ExerciseFormPage |
| `/workouts` | WorkoutsListPage |
| `/workouts/edit` | WorkoutEditorPage (criar) |
| `/workouts/edit/:id` | WorkoutEditorPage (editar) |
| `/workouts/training` | TrainingModePage |
| `/frequency` | FrequencyPage |
| `/import` | ImportPage |

## Firestore Schema
Todos os dados sob `users/{userId}/`:
- `muscleGroups/{id}` — `{ name }`
- `exercises/{id}` — `{ name, muscleGroupId, imageUrl, videoUrl, substituteIds[] }`
- `workouts/{id}` — `{ name, exercises[], lastCompleted }`
- `history/{id}` — `{ workoutId, workoutName, completionDate, exerciseLogs[] }`
- `profile/data` — `{ name, height, age, gender, measurementHistory[] }`

## Regras de segurança Firestore
Ficheiro `firestore.rules` criado na raiz. Deploy: `firebase deploy --only firestore:rules`.

## Padrões obrigatórios
- **Hooks** sempre antes de qualquer `return` condicional (Rules of Hooks)
- **Navegação** via `useNavigate()` — nunca `window.history`
- **Active state** via `useLocation().pathname.startsWith(path)`
- **Erros** via `showError(msg)` de `useToast()` — nunca `alert()`
- **Params** via `useParams()` — nunca props manuais
- **Guard de sessão** em `TrainingModePage`: `useEffect` que navega quando `activeSession` é null (guard APÓS todos os hooks)

## Scripts
```bash
npm start   # dev server porta 3000
npm test    # Jest
npm run build  # build de produção (sem warnings = deploy OK)
```

## Armadilhas conhecidas
- `.env.local` **não é copiado** automaticamente para novos worktrees — copiar manualmente de `.env.development`
- `user?.uid` em `App.js` — necessário porque JSX avalia children antes do ProtectedRoute redirecionar
- Se Firestore falhar, `profile` ficaria `null` para sempre — o error callback em `AppContext.js` seta um perfil fallback
