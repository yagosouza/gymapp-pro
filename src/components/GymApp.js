import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './layout/Sidebar';
import BottomNavBar from './layout/BottomNavBar';
import InstallPWA from './InstallPWA';
import { GlobalStyles } from './ui/GlobalStyles';
import { PageErrorBoundary } from './ErrorBoundary';
import { Menu } from 'lucide-react';

import { HomePage } from '../pages/HomePage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import ListPageContainer from '../pages/list/ListPageContainer';
import { GroupFormPage } from '../pages/groups/GroupFormPage';
import { ExerciseFormPage } from '../pages/exercises/ExerciseFormPage';
import WorkoutsListPage from '../pages/workouts/WorkoutsListPage';
import TrainingModePage from '../pages/workouts/TrainingModePage';
import WorkoutEditorPage from '../pages/workouts/WorkoutEditorPage';
import ImportPage from '../pages/import/ImportPage';
import { FrequencyPage } from '../pages/frequency/FrequencyPage';

export default function GymApp() {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const touchStartRef = useRef(null);

    // Gesto de deslizar para abrir a sidebar no iOS/Android
    useEffect(() => {
        const handleTouchStart = (e) => {
            const startX = e.touches[0].clientX;
            if (startX > 20 && startX < 80) {
                touchStartRef.current = startX;
            } else {
                touchStartRef.current = null;
            }
        };

        const handleTouchMove = (e) => {
            if (touchStartRef.current === null) return;
            const touchEnd = e.touches[0].clientX;
            if (touchEnd > touchStartRef.current + 100) {
                setIsSidebarOpen(true);
                touchStartRef.current = null;
            }
        };

        document.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchmove', handleTouchMove);
        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
        };
    }, []);

    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/') return 'Início';
        if (path === '/profile') return 'Meu Perfil';
        if (path === '/groups/create') return 'Criando Grupo';
        if (path.startsWith('/groups/edit')) return 'Editando Grupo';
        if (path === '/groups') return 'Grupos Musculares';
        if (path === '/exercises/create') return 'Criando Exercício';
        if (path.startsWith('/exercises/edit')) return 'Editando Exercício';
        if (path === '/exercises') return 'Exercícios';
        if (path === '/workouts/training') return 'Treino em Andamento';
        if (path.startsWith('/workouts/edit')) return 'Editor de Treino';
        if (path === '/workouts') return 'Meus Treinos';
        if (path === '/frequency') return 'Frequência';
        if (path === '/import') return 'Importar Treino';
        return 'GymApp Pro';
    };

    return (
        <div className="flex h-screen bg-gray-900 text-gray-200 font-sans">
            <GlobalStyles />
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />
            <main className="flex-1 flex flex-col overflow-y-auto transition-all duration-300 pb-16 md:pb-0">
                <div className="p-4 pt-[calc(1rem+env(safe-area-inset-top))] bg-gray-900/80 backdrop-blur-sm sticky top-0 z-20 flex items-center md:hidden">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-md hover:bg-gray-700">
                        <Menu size={24} />
                    </button>
                    <h1 className="text-xl font-semibold ml-4">{getPageTitle()}</h1>
                </div>
                <div className="p-4 sm:p-6 lg:p-8 flex-1">
                    <Routes>
                        <Route path="/" element={<PageErrorBoundary><HomePage /></PageErrorBoundary>} />
                        <Route path="/profile" element={<PageErrorBoundary><ProfilePage /></PageErrorBoundary>} />
                        <Route path="/groups" element={<PageErrorBoundary><ListPageContainer pageTitle="Grupos Musculares" itemType="groups" /></PageErrorBoundary>} />
                        <Route path="/groups/create" element={<PageErrorBoundary><GroupFormPage /></PageErrorBoundary>} />
                        <Route path="/groups/edit/:id" element={<PageErrorBoundary><GroupFormPage /></PageErrorBoundary>} />
                        <Route path="/exercises" element={<PageErrorBoundary><ListPageContainer pageTitle="Exercícios" itemType="exercises" /></PageErrorBoundary>} />
                        <Route path="/exercises/create" element={<PageErrorBoundary><ExerciseFormPage /></PageErrorBoundary>} />
                        <Route path="/exercises/edit/:id" element={<PageErrorBoundary><ExerciseFormPage /></PageErrorBoundary>} />
                        <Route path="/workouts" element={<PageErrorBoundary><WorkoutsListPage /></PageErrorBoundary>} />
                        <Route path="/workouts/edit" element={<PageErrorBoundary><WorkoutEditorPage /></PageErrorBoundary>} />
                        <Route path="/workouts/edit/:id" element={<PageErrorBoundary><WorkoutEditorPage /></PageErrorBoundary>} />
                        <Route path="/workouts/training" element={<PageErrorBoundary><TrainingModePage /></PageErrorBoundary>} />
                        <Route path="/frequency" element={<PageErrorBoundary><FrequencyPage /></PageErrorBoundary>} />
                        <Route path="/import" element={<PageErrorBoundary><ImportPage /></PageErrorBoundary>} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </main>
            <BottomNavBar setIsSidebarOpen={setIsSidebarOpen} />
            <InstallPWA />
        </div>
    );
}
