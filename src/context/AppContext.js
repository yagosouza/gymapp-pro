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
    const [currentView, setCurrentView] = useState({ page: 'home' });
    const [activeSession, setActiveSession] = useStickyState(null, 'activeWorkoutSession');

    const startWorkoutSession = (workoutId) => {
        const workoutToStart = workouts.find(w => w.id === workoutId);
        console.log('Iniciando treino:', workoutToStart);
        if (!workoutToStart) return;
        setActiveSession({
            workoutId: workoutId,
            logs: workoutToStart.exercises.reduce((acc, ex) => {
                acc[ex.workoutExerciseId] = { sets: ex.sets, reps: ex.reps, weight: ex.weight || '', completed: false };
                return acc;
            }, {})
        });
        setCurrentView({ page: 'workouts', mode: 'training' });
    };

    const value = {
        muscleGroups, setMuscleGroups,
        exercises, setExercises,
        workouts, setWorkouts,
        profile, setProfile,
        history, setHistory,
        currentView, setCurrentView,
        activeSession, setActiveSession,
        startWorkoutSession
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
