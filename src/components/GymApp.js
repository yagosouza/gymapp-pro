import React, { useState, useEffect } from 'react';
import Sidebar from './layout/Sidebar';
import MainContent from './MainContent';
import BottomNavBar from './layout/BottomNavBar'; // Importar
import { useAppContext } from '../context/AppContext';
import { Menu } from 'lucide-react';
import { GlobalStyles } from './ui/GlobalStyles';

export default function GymApp({ onLogout }) {
    const { setActiveSession, goBack } = useAppContext();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const handleActualLogout = () => {
        setActiveSession(null);
        onLogout();
    }

    // Efeito para o botão "voltar" do Android
    useEffect(() => {
        const handlePopState = (event) => {
            event.preventDefault();
            goBack(); // Chama a nossa nova função de voltar
        };
        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [goBack]);

    return (
        <div className="flex h-screen bg-gray-900 text-gray-200 font-sans">
            <GlobalStyles />
            <Sidebar 
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                onLogout={handleActualLogout} 
            />
            <main className="flex-1 flex flex-col overflow-y-auto transition-all duration-300 pb-16 md:pb-0"> {/* Adicionar padding */}
                <div className="p-4 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-20 flex items-center md:hidden">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-md hover:bg-gray-700">
                        <Menu size={24} />
                    </button>
                    <h1 className="text-xl font-semibold ml-4">GymApp Pro</h1>
                </div>
                <div className="p-4 sm:p-6 lg:p-8 flex-1">
                    <MainContent />
                </div>
            </main>
            <BottomNavBar /> {/* Adicionar o componente */}
        </div>
    );
}
