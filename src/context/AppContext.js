import React, { createContext, useContext, useState } from 'react';
import { useStickyState } from '../hooks/useStickyState';
import { 
    initialMuscleGroups, 
    initialExercises, 
    initialWorkouts, 
    initialProfile, 
    initialHistory 
} from '../constants/initialData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [muscleGroups, setMuscleGroups] = useStickyState(initialMuscleGroups, 'muscleGroups');
    const [exercises, setExercises] = useStickyState(initialExercises, 'exercises');
    const [workouts, setWorkouts] = useStickyState(initialWorkouts, 'workouts');
    const [profile, setProfile] = useStickyState(initialProfile, 'profile');
    const [history, setHistory] = useStickyState(initialHistory, 'history');
    
    // O estado da vista agora é um histórico de objetos
    const [viewHistory, setViewHistory] = useState([{ page: 'home' }]);
    const currentView = viewHistory[viewHistory.length - 1];

    const [activeSession, setActiveSession] = useStickyState(null, 'activeWorkoutSession');

    // Nova função para navegar, que adiciona ao histórico
    const navigateTo = (view) => {
        // Adiciona um estado ao histórico do navegador para o botão de voltar funcionar
        window.history.pushState({ page: view.page }, '');
        setViewHistory(prevHistory => [...prevHistory, view]);
    };

    // Nova função para voltar, que remove do histórico
    const goBack = () => {
        setViewHistory(prevHistory => {
            if (prevHistory.length > 1) {
                return prevHistory.slice(0, -1);
            }
            return prevHistory; // Não remove o último item (home)
        });
    };

    const startWorkoutSession = (workoutId) => {
        const workoutToStart = workouts.find(w => w.id === workoutId);
        if (!workoutToStart) return;

        const initialLogs = workoutToStart.exercises.reduce((acc, ex) => {
            const numSets = parseInt(ex.sets, 10) || 0;
            acc[ex.workoutExerciseId] = {
                originalExerciseId: ex.exerciseId,
                currentExerciseId: ex.exerciseId,
                sets: Array.from({ length: numSets }, (_, i) => ({
                    id: Date.now() + i,
                    reps: ex.reps || '',
                    weight: ex.weight || '',
                    completed: false,
                })),
                rest: ex.rest || 60
            };
            return acc;
        }, {});

        setActiveSession({
            workoutId: workoutId,
            logs: initialLogs,
            startTime: Date.now()
        });
        navigateTo({ page: 'workouts', mode: 'training' });
    };

    const value = {
        muscleGroups, setMuscleGroups,
        exercises, setExercises,
        workouts, setWorkouts,
        profile, setProfile,
        history, setHistory,
        currentView,
        navigateTo, // Exporta a nova função de navegação
        goBack,     // Exporta a nova função de voltar
        activeSession, setActiveSession,
        startWorkoutSession
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);