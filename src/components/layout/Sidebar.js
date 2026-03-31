import React from 'react';
import { Home, Dumbbell, ClipboardList, ArrowLeft, Layers, User, LogOut, Repeat, Upload, Activity } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { APP_VERSION } from '../../constants/initialData';
import { auth } from '../../firebase/config';
import { signOut } from "firebase/auth";

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { activeSession, workouts } = useAppContext();

    const activeWorkout = activeSession ? workouts.find(w => w.id === activeSession.workoutId) : null;

    const navItems = [
        { id: 'home', label: 'Início', icon: Home, path: '/' },
        { id: 'profile', label: 'Meu Perfil', icon: User, path: '/profile' },
        { id: 'groups', label: 'Grupos Musculares', icon: Layers, path: '/groups' },
        { id: 'exercises', label: 'Exercícios', icon: Dumbbell, path: '/exercises' },
        { id: 'workouts', label: 'Treinos', icon: ClipboardList, path: '/workouts' },
        { id: 'frequency', label: 'Frequência', icon: Activity, path: '/frequency' },
        { id: 'import', label: 'Importar Treino', icon: Upload, path: '/import' },
    ];

    const handleNav = (path) => {
        navigate(path);
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    };

    const handleReturnToWorkout = () => {
        navigate('/workouts/training');
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    };

    const handleLogout = () => {
        signOut(auth);
    };

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/60 z-30 md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsSidebarOpen(false)}
            />
            <aside className={`absolute md:relative flex flex-col bg-gray-800 shadow-lg z-40 h-full transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-64 pb-16 md:pb-0`}>
                <div className="p-4 pt-[calc(1rem+env(safe-area-inset-top))] border-b border-gray-700 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Dumbbell className="text-blue-400" /> GymApp
                    </h1>
                    <button onClick={() => setIsSidebarOpen(false)} className="p-1 rounded-md hover:bg-gray-700 md:hidden">
                        <ArrowLeft size={20} />
                    </button>
                </div>
                <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
                    {activeWorkout && (
                        <div className="p-2">
                            <button
                                onClick={handleReturnToWorkout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-lg bg-green-600/80 text-white font-semibold shadow-md animate-pulse"
                            >
                                <Repeat size={24} />
                                <span>{activeWorkout.name}</span>
                            </button>
                        </div>
                    )}
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleNav(item.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-lg transition-colors ${isActive(item.path) ? 'bg-blue-600 text-white font-semibold shadow-md' : 'hover:bg-gray-700 text-gray-300'}`}
                        >
                            <item.icon size={24} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
                <footer className="p-4 border-t border-gray-700 text-center text-xs text-gray-500 space-y-2">
                    <p>Versão {APP_VERSION}</p>
                    {process.env.NODE_ENV === 'development' && (
                        <div>
                            <span className="inline-block bg-yellow-500/20 text-yellow-300 font-bold px-2 py-1 rounded-md">
                                MODO DEV
                            </span>
                        </div>
                    )}
                </footer>
                <div className="p-2">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-lg hover:bg-red-800/50 text-red-400 transition-colors"
                    >
                        <LogOut size={24} />
                        <span>Sair</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
