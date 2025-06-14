import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Home, ClipboardList, User } from 'lucide-react';

export default function BottomNavBar() {
    const { currentView, navigateTo } = useAppContext();

    const navItems = [
        { id: 'home', label: 'Início', icon: Home },
        { id: 'workouts', label: 'Treinos', icon: ClipboardList },
        { id: 'profile', label: 'Perfil', icon: User },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 flex justify-around items-start pt-2 pb-[env(safe-area-inset-bottom)] md:hidden z-50">
            {navItems.map(item => {
                const isActive = currentView.page === item.id;
                return (
                    <button 
                        key={item.id} 
                        onClick={() => navigateTo({ page: item.id })}
                        className={`flex flex-col items-center justify-center w-full rounded-lg py-1 transition-colors ${isActive ? 'text-blue-400' : 'text-gray-400 hover:bg-gray-700'}`}
                    >
                        <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        <span className={`text-xs mt-1 ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
                    </button>
                );
            })}
        </nav>
    );
}
