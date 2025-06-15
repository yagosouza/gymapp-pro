import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './layout/Sidebar';
import MainContent from './MainContent';
import BottomNavBar from './layout/BottomNavBar'; // Importar
import InstallPWA from './InstallPWA'; // Importar
import { useAppContext } from '../context/AppContext';
import { Menu } from 'lucide-react';
import { GlobalStyles } from './ui/GlobalStyles';

export default function GymApp({ onLogout }) {
    const { setActiveSession, goBack } = useAppContext();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const touchStartRef = useRef(null);
    
    const handleActualLogout = () => {
        setActiveSession(null);
        onLogout();
    }

    // Efeito para o botão "voltar" do Android
    useEffect(() => {
        const handlePopState = (event) => {
            event.preventDefault();

            // Se a sidebar estiver aberta, fecha-a. Caso contrário, volta a página.
            if (isSidebarOpen) {
                setIsSidebarOpen(false);
            } else {
                goBack();
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [isSidebarOpen, goBack]);

    // Efeito para o gesto de deslizar
    useEffect(() => {
        const handleTouchStart = (e) => {
            const startX = e.touches[0].clientX;
            // Ativa o nosso gesto apenas se começar um pouco afastado da borda (ex: entre 20px e 80px)
            // para não interferir com o gesto "voltar" do iOS que começa na borda.
            if (startX > 20 && startX < 80) {
                touchStartRef.current = startX;
            } else {
                touchStartRef.current = null;
            }
        };

        const handleTouchMove = (e) => {
            if (touchStartRef.current === null) return;
            const touchEnd = e.touches[0].clientX;
            
            // Se o dedo se moveu mais de 100 pixels para a direita, abre a sidebar
            if (touchEnd > touchStartRef.current + 100) {
                setIsSidebarOpen(true);
                touchStartRef.current = null; // Reseta para não reativar
            }
        };

        document.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchmove', handleTouchMove);

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
        };
    }, []);

    return (
        <div className="flex h-screen bg-gray-900 text-gray-200 font-sans">
            <GlobalStyles />
            <Sidebar 
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                onLogout={handleActualLogout} 
            />
            <main className="flex-1 flex flex-col overflow-y-auto transition-all duration-300 pb-16 md:pb-0"> {/* Adicionar padding */}
                <div className="p-4 pt-[calc(1rem+env(safe-area-inset-top))] bg-gray-900/80 backdrop-blur-sm sticky top-0 z-20 flex items-center md:hidden">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-md hover:bg-gray-700">
                        <Menu size={24} />
                    </button>
                    <h1 className="text-xl font-semibold ml-4">GymApp Pro</h1>
                </div>
                <div className="p-4 sm:p-6 lg:p-8 flex-1">
                    <MainContent />
                </div>
            </main>
            <BottomNavBar setIsSidebarOpen={setIsSidebarOpen} /> {/* Adicionar o componente */}
            <InstallPWA /> {/* Adicionar o componente de instalação PWA */}
        </div>
    );
}
