import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from '../firebase/config';
import { collection, onSnapshot, doc, setDoc, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { useStickyState } from '../hooks/useStickyState';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';

const AppContext = createContext();

// Função auxiliar para simplificar a criação das funções de manipulação
const createFirestoreCollectionSetters = (collectionName, userId) => ({
    // Adiciona um novo documento à coleção
    create: (data) => addDoc(collection(db, 'users', userId, collectionName), data),
    // Atualiza um documento existente
    update: (id, data) => updateDoc(doc(db, 'users', userId, collectionName, id), data),
    // Deleta um documento
    delete: (id) => deleteDoc(doc(db, 'users', userId, collectionName, id)),
});

export const AppProvider = ({ children, userId }) => {
        console.log("AppProvider recebeu userId:", userId); 


    const [muscleGroups, setMuscleGroups] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [workouts, setWorkouts] = useState([]);
    const [profile, setProfile] = useState(null);
    const [history, setHistory] = useState([]);
    
    const [viewHistory, setViewHistory] = useState([{ page: 'home' }]);
    const currentView = viewHistory[viewHistory.length - 1];
    const [activeSession, setActiveSession] = useStickyState(null, 'activeWorkoutSession'); // Pode manter em localStorage ou mover para Firestore

    useEffect(() => {
        if (!userId) {
             // Limpa os dados se o utilizador fizer logout
            setMuscleGroups([]);
            setExercises([]);
            setWorkouts([]);
            setProfile(null);
            setHistory([]);
            return;
        };

        const unsubscribers = [
            onSnapshot(collection(db, 'users', userId, 'muscleGroups'), snapshot =>
                setMuscleGroups(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
            ),
            onSnapshot(collection(db, 'users', userId, 'exercises'), snapshot =>
                setExercises(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
            ),
            onSnapshot(collection(db, 'users', userId, 'workouts'), snapshot =>
                setWorkouts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
            ),
            onSnapshot(collection(db, 'users', userId, 'history'), snapshot =>
                setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
            ),
            onSnapshot(doc(db, 'users', userId, 'profile', 'data'), (documentSnapshot) => {
                                console.log("Snapshot do perfil recebido!");

                // Define uma estrutura de perfil padrão/ideal
                const defaultProfile = { 
                    name: auth.currentUser?.displayName || auth.currentUser?.email || 'Novo Utilizador', 
                    height: '',
                    age: '',
                    gender: 'male',
                    measurementHistory: [] 
                };

                if (documentSnapshot.exists()) {
                    // Se o documento existe, pega os dados
                                        console.log("Documento do perfil EXISTE:", documentSnapshot.data());

                    const existingData = documentSnapshot.data();
                    
                    // Junta os dados padrão com os dados existentes.
                    // Isso garante que campos que faltavam (como measurementHistory) sejam adicionados.
                    const completeProfile = { ...defaultProfile, ...existingData };

                    setProfile(completeProfile);

                    // Opcional mas recomendado: se o perfil no DB estava incompleto, atualize-o.
                    if (!existingData.hasOwnProperty('measurementHistory')) {
                        updateDoc(documentSnapshot.ref, { measurementHistory: [] });
                    }

                } else {
                                        console.log("Documento do perfil NÃO EXISTE. A criar um novo.");

                    // Se o documento não existe, cria um novo a partir do padrão.
                    console.log("Perfil não encontrado. A criar perfil inicial...");
                    setProfile(defaultProfile); 
                    setDoc(documentSnapshot.ref, defaultProfile).catch(error => {
                        console.error("Erro ao criar perfil inicial no Firestore:", error);
                    });
                }
             }, (error) => { // <---- ADICIONE ESTE BLOCO DE ERRO
                console.error("ERRO no listener do onSnapshot:", error);
            }),
        ];

        return () => unsubscribers.forEach(unsub => unsub());
    }, [userId]);

    const muscleGroupsAPI = createFirestoreCollectionSetters('muscleGroups', userId);
    const exercisesAPI = createFirestoreCollectionSetters('exercises', userId);
    const workoutsAPI = createFirestoreCollectionSetters('workouts', userId);
    const historyAPI = createFirestoreCollectionSetters('history', userId);
    const updateProfileAPI = (data) => updateDoc(doc(db, 'users', userId, 'profile', 'data'), data);

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
        // Estados
        muscleGroups, exercises, workouts, profile, history,
        // API de dados
        muscleGroupsAPI, exercisesAPI, workoutsAPI, historyAPI, updateProfileAPI,
        // Navegação e Sessão
        currentView, navigateTo, goBack,
        activeSession, setActiveSession,
        startWorkoutSession
    };

    // Não renderiza nada até o perfil ser carregado para evitar erros
    if (profile === null) {
        return <LoadingOverlay isActive={profile === null} message="A carregar dados..." />;
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);