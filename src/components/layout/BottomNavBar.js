import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ClipboardList, User } from 'lucide-react';

export default function BottomNavBar({ setIsSidebarOpen }) {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { id: 'home', label: 'Início', icon: Home, path: '/' },
        { id: 'workouts', label: 'Treinos', icon: ClipboardList, path: '/workouts' },
        { id: 'profile', label: 'Perfil', icon: User, path: '/profile' },
    ];

    const handleNav = (path) => {
        navigate(path);
        setIsSidebarOpen(false);
    };

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 flex justify-around items-start pt-2 pb-[env(safe-area-inset-bottom)] md:hidden z-50">
            {navItems.map(item => {
                const active = isActive(item.path);
                return (
                    <button
                        key={item.id}
                        onClick={() => handleNav(item.path)}
                        className={`flex flex-col items-center justify-center w-full rounded-lg py-1 transition-colors ${active ? 'text-blue-400' : 'text-gray-400 hover:bg-gray-700'}`}
                    >
                        <item.icon size={24} strokeWidth={active ? 2.5 : 2} />
                        <span className={`text-xs mt-1 ${active ? 'font-bold' : ''}`}>{item.label}</span>
                    </button>
                );
            })}
        </nav>
    );
}
