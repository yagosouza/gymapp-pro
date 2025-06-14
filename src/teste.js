
// import React, { useState, useEffect, useRef, use } from 'react';
// import { Home, Dumbbell, ClipboardList, Menu, ArrowLeft, Layers,  User, LogOut,  Repeat} from 'lucide-react';

// import { initialMuscleGroups, initialExercises, initialWorkouts, initialProfile, initialHistory} from './constants/initialData.js';

// import { GlobalStyles } from './components/ui/GlobalStyles.js';

// import { HomePage } from './pages/HomePage.js'
// import { ProfilePage } from './pages/profile/ProfilePage.js'
// import { GroupFormPage } from './pages/groups/GroupFormPage.js'
// import { ListPageContainer } from './pages/list/ListPageContainer.js'
// import { ExerciseFormPage } from './pages/exercises/ExerciseFormPage.js'
// import { WorkoutsPage } from './pages/workouts/WorkoutsListPage.js'
// import { TrainingModePage } from './pages/workouts/TrainingModePage.js'
// import { WorkoutEditor } from './pages/workouts/WorkoutEditorPage.js'
// import { LoginPage } from './pages/auth/LoginPage.js'
// import useStickyState from './hooks/useStickyState.js';
// import { Sidebar } from './components/layout/Sidebar.js';

// // --- Componentes de Navegação e Estrutura ---

// function GymAppPro({ onLogout }) {
//   const [muscleGroups, setMuscleGroups] = useStickyState(initialMuscleGroups, 'muscleGroups');
//   const [exercises, setExercises] = useStickyState(initialExercises, 'exercises');
//   const [workouts, setWorkouts] = useStickyState(initialWorkouts, 'workouts');
//   const [profile, setProfile] = useStickyState(initialProfile, 'profile');
//   const [history, setHistory] = useStickyState(initialHistory, 'history');
  
//   const [currentView, setCurrentView] = useState({ page: 'home' });
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [activeSession, setActiveSession] = useStickyState(null, 'activeWorkoutSession');

//   const startWorkoutSession = (workoutId) => {
//     const workoutToStart = workouts.find(w => w.id === workoutId);
//     if (!workoutToStart) return;
//     setActiveSession({
//         workoutId: workoutId,
//         logs: workoutToStart.exercises.reduce((acc, ex) => {
//             acc[ex.workoutExerciseId] = { sets: ex.sets, reps: ex.reps, weight: ex.weight || '', completed: false };
//             return acc;
//         }, {})
//     });
//     setCurrentView({ page: 'workouts', mode: 'training' });
//   };
  
//   useEffect(() => { if (window.innerWidth < 768) setIsSidebarOpen(false); }, []);

//   const renderPage = () => {
//     switch (currentView.page) {
//       case 'home': return <HomePage workouts={workouts} exercises={exercises} history={history} profile={profile} setCurrentView={setCurrentView} />;
//       case 'profile': return <ProfilePage profile={profile} setProfile={setProfile} />;
//       case 'groups': 
//         if(currentView.mode === 'create'){ 
//             return <GroupFormPage onSave={() => setCurrentView({page: 'groups'})} onCancel={() => setCurrentView({page: 'groups'})} muscleGroups={muscleGroups} setMuscleGroups={setMuscleGroups} />; 
//         }
//         if(currentView.mode === 'edit'){ 
//             const group = muscleGroups.find(g => g.id === currentView.id); 
//             return <GroupFormPage group={group} onSave={() => setCurrentView({page: 'groups'})} onCancel={() => setCurrentView({page: 'groups'})} muscleGroups={muscleGroups} setMuscleGroups={setMuscleGroups} />; 
//         }
//         return <ListPageContainer pageTitle="Grupos Musculares" itemType="groups" setCurrentView={setCurrentView} muscleGroups={muscleGroups} setMuscleGroups={setMuscleGroups} exercises={exercises} />;
//       case 'exercises':
//         if (currentView.mode === 'create') { 
//             return <ExerciseFormPage onSave={() => setCurrentView({ page: 'exercises' })} onCancel={() => setCurrentView({ page: 'exercises' })} exercises={exercises} setExercises={setExercises} muscleGroups={muscleGroups} />; 
//         }
//         if (currentView.mode === 'edit') { 
//             const exercise = exercises.find(ex => ex.id === currentView.id); 
//             return <ExerciseFormPage exercise={exercise} onSave={() => setCurrentView({ page: 'exercises' })} onCancel={() => setCurrentView({ page: 'exercises' })} exercises={exercises} setExercises={setExercises} muscleGroups={muscleGroups} />; 
//         }
//         return <ListPageContainer pageTitle="Exercícios" itemType="exercises" setCurrentView={setCurrentView} exercises={exercises} setExercises={setExercises} muscleGroups={muscleGroups} history={history} />;
//       case 'workouts':
//         if (currentView.mode === 'training' && activeSession) {
//           const workout = workouts.find(w => w.id === activeSession.workoutId);
//           if (!workout) { 
//             setActiveSession(null); 
//             return <WorkoutsPage workouts={workouts} setWorkouts={setWorkouts} allExercises={exercises} setCurrentView={setCurrentView} onStartWorkout={startWorkoutSession} history={history} />; 
//         }
//           return <TrainingModePage workout={workout} setWorkouts={setWorkouts} allExercises={exercises} backToList={() => setCurrentView({ page: 'workouts'})} setHistory={setHistory} history={history} activeSession={activeSession} setActiveSession={setActiveSession} />;
//         }
//         if (currentView.mode === 'edit') {
//             const workout = currentView.id ? workouts.find(w => w.id === currentView.id) : { name: 'Novo Treino', exercises: [] };
//             const handleSave = (editedWorkout) => {
//                 if (currentView.id) { 
//                     setWorkouts(workouts.map(w => w.id === currentView.id ? editedWorkout : w));
//                 } else { 
//                     setWorkouts([...workouts, {...editedWorkout, id: Date.now()}]); 
//                 }
//                 setCurrentView({ page: 'workouts' });
//             };
//             return <WorkoutEditor workout={workout} onSave={handleSave} onCancel={() => setCurrentView({ page: 'workouts' })} allExercises={exercises} history={history} /> 
//         }
//         return <WorkoutsPage workouts={workouts} setWorkouts={setWorkouts} allExercises={exercises} setCurrentView={setCurrentView} onStartWorkout={startWorkoutSession} history={history} />;
//       default: return <HomePage workouts={workouts} exercises={exercises} history={history} profile={profile} setCurrentView={setCurrentView} />;
//     }
//   };
  
//   const activeWorkout = activeSession ? workouts.find(w => w.id === activeSession.workoutId) : null;

//   return (
//     <div className="flex h-screen bg-gray-900 text-gray-200 font-sans">
//       <GlobalStyles />
//       <Sidebar 
//           currentView={currentView} 
//           setCurrentView={setCurrentView} 
//           isSidebarOpen={isSidebarOpen} 
//           setIsSidebarOpen={setIsSidebarOpen} 
//           onLogout={onLogout} 
//           activeWorkoutName={activeWorkout?.name} 
//           onReturnToWorkout={() => setCurrentView({ page: 'workouts', mode: 'training' })}
//       />
//       <main className="flex-1 flex flex-col overflow-y-auto transition-all duration-300">
//          <div className="p-4 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-20 flex items-center md:hidden"><button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-md hover:bg-gray-700"><Menu size={24} /></button><h1 className="text-xl font-semibold ml-4">GymApp Pro</h1></div>
//         <div className="p-4 sm:p-6 lg:p-8 flex-1">{renderPage()}</div>
//       </main>
//     </div>
//   );
// }

// // --- Componente Raiz (Gerencia Autenticação) ---
// export default function App() {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const handleLogin = (username, password) => {
//         if ((username === 'admin' && password === 'admin') || (username === '' && password === '')) { setIsLoggedIn(true);
//         } else { alert('Utilizador ou senha inválidos'); }
//     };
//     const handleLogout = () => {
//         // Limpa a sessão ativa ao fazer logout
//         localStorage.removeItem('activeWorkoutSession');
//         setIsLoggedIn(false); 
//     };
//     if (!isLoggedIn) { return <LoginPage onLogin={handleLogin} />; }
//     return <GymAppPro onLogout={handleLogout} />;
// }

// Este é o app.js sem AppContext, AppProvider e GymApp