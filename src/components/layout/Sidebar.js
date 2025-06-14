import { Home, Dumbbell, ClipboardList, ArrowLeft, Layers,  User, LogOut,  Repeat} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { APP_VERSION } from '../../constants/initialData';

export default function Sidebar({  isSidebarOpen, setIsSidebarOpen, onLogout }) {
  const { currentView, navigateTo, activeSession, workouts } = useAppContext();
    
    const activeWorkout = activeSession ? workouts.find(w => w.id === activeSession.workoutId) : null;

    const navItems = [
        { id: 'home', label: 'Início', icon: Home },
        { id: 'profile', label: 'Meu Perfil', icon: User },
        { id: 'groups', label: 'Grupos Musculares', icon: Layers },
        { id: 'exercises', label: 'Exercícios', icon: Dumbbell },
        { id: 'workouts', label: 'Treinos', icon: ClipboardList },
    ];
    
    const handleNav = (page) => {
        navigateTo({ page });
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    };

    const handleReturnToWorkout = () => {
        navigateTo({ page: 'workouts', mode: 'training' });
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    }

    return (
       <>
        <div className={`fixed inset-0 bg-black/60 z-30 md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)}></div>
        <aside className={`absolute md:relative flex flex-col bg-gray-800 shadow-lg z-40 h-full transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-64`}>
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Dumbbell className="text-blue-400"/> GymApp</h1>
            <button onClick={() => setIsSidebarOpen(false)} className="p-1 rounded-md hover:bg-gray-700 md:hidden"><ArrowLeft size={20} /></button>
          </div>
          <nav className="flex-1 p-2 space-y-1">
            {activeWorkout && (
                <div className="p-2">
                    <button onClick={handleReturnToWorkout} className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-lg bg-green-600/80 text-white font-semibold shadow-md animate-pulse">
                        <Repeat size={24}/>
                        <span>{activeWorkout.name}</span>
                    </button>
                </div>
            )}
            {navItems.map(item => (
              <button 
                key={item.id} 
                onClick={() => handleNav(item.id)} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-lg transition-colors ${currentView.page === item.id ? 'bg-blue-600 text-white font-semibold shadow-md' : 'hover:bg-gray-700 text-gray-300'}`}>
                <item.icon size={24} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <footer className="p-4 border-t border-gray-700 text-center text-xs text-gray-500">
            <p>Versão {APP_VERSION}</p>
          </footer>
          <div className="p-2">
            <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-lg hover:bg-red-800/50 text-red-400 transition-colors">
                <LogOut size={24}/>
                <span>Sair</span>
            </button>
          </div>
        </aside>
     </>
  );
}