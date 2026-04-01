import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from '../firebase/config';
import { collection, onSnapshot, doc, setDoc, addDoc, deleteDoc, updateDoc, query, orderBy, limit } from "firebase/firestore";
import { useStickyState } from '../hooks/useStickyState';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';
import { useNavigate } from 'react-router-dom';
import { useToast } from './ToastContext';

const AppContext = createContext();

// Função auxiliar para simplificar a criação das funções de manipulação
const createFirestoreCollectionSetters = (collectionName, userId) => ({
    create: (data) => addDoc(collection(db, 'users', userId, collectionName), data),
    update: (id, data) => updateDoc(doc(db, 'users', userId, collectionName, id), data),
    delete: (id) => deleteDoc(doc(db, 'users', userId, collectionName, id)),
});

export const AppProvider = ({ children, userId }) => {
    const navigate = useNavigate();
    const { showError } = useToast();

    const [muscleGroups, setMuscleGroups] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [workouts, setWorkouts] = useState([]);
    const [profile, setProfile] = useState(null);
    const [history, setHistory] = useState([]);

    const [activeSession, setActiveSession] = useStickyState(null, 'activeWorkoutSession');

    useEffect(() => {
        if (!userId) {
            setMuscleGroups([]);
            setExercises([]);
            setWorkouts([]);
            setProfile(null);
            setHistory([]);
            return;
        }

        const historyQuery = query(
            collection(db, 'users', userId, 'history'),
            orderBy('completionDate', 'desc'),
            limit(50)
        );

        const unsubscribers = [
            onSnapshot(
                collection(db, 'users', userId, 'muscleGroups'),
                snapshot => setMuscleGroups(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))),
                () => showError('Erro ao carregar grupos musculares.')
            ),
            onSnapshot(
                collection(db, 'users', userId, 'exercises'),
                snapshot => setExercises(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))),
                () => showError('Erro ao carregar exercícios.')
            ),
            onSnapshot(
                collection(db, 'users', userId, 'workouts'),
                snapshot => setWorkouts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))),
                () => showError('Erro ao carregar treinos.')
            ),
            onSnapshot(
                historyQuery,
                snapshot => setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))),
                () => showError('Erro ao carregar histórico.')
            ),
            onSnapshot(doc(db, 'users', userId, 'profile', 'data'), (documentSnapshot) => {
                const defaultProfile = {
                    name: auth.currentUser?.displayName || auth.currentUser?.email || 'Novo Utilizador',
                    height: '',
                    age: '',
                    gender: 'male',
                    measurementHistory: []
                };

                if (documentSnapshot.exists()) {
                    const existingData = documentSnapshot.data();
                    const completeProfile = { ...defaultProfile, ...existingData };
                    setProfile(completeProfile);
                    if (!existingData.hasOwnProperty('measurementHistory')) {
                        updateDoc(documentSnapshot.ref, { measurementHistory: [] });
                    }
                } else {
                    setProfile(defaultProfile);
                    setDoc(documentSnapshot.ref, defaultProfile).catch(error => {
                        console.error("Erro ao criar perfil inicial no Firestore:", error);
                    });
                }
            }, (error) => {
                console.error("Erro ao carregar perfil:", error);
                showError('Erro ao carregar perfil. Verifique a ligação.');
                setProfile({
                    name: auth.currentUser?.displayName || auth.currentUser?.email || 'Utilizador',
                    height: '', age: '', gender: 'male', measurementHistory: []
                });
            }),
        ];

        return () => unsubscribers.forEach(unsub => unsub());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    const muscleGroupsAPI = createFirestoreCollectionSetters('muscleGroups', userId);
    const exercisesAPI = createFirestoreCollectionSetters('exercises', userId);
    const workoutsAPI = createFirestoreCollectionSetters('workouts', userId);
    const historyAPI = createFirestoreCollectionSetters('history', userId);
    const updateProfileAPI = (data) => updateDoc(doc(db, 'users', userId, 'profile', 'data'), data);

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
        navigate('/workouts/training');
    };

    const value = {
        // Estados
        muscleGroups, exercises, workouts, profile, history,
        // API de dados
        muscleGroupsAPI, exercisesAPI, workoutsAPI, historyAPI, updateProfileAPI,
        // Sessão
        activeSession, setActiveSession,
        startWorkoutSession
    };

    if (profile === null) {
        return <LoadingOverlay isActive={profile === null} message="A carregar dados..." />;
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
