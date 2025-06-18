import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { UploadCloud } from 'lucide-react';
import { collection, getDocs, addDoc, setDoc, doc } from "firebase/firestore";
import { auth, db } from '../../firebase/config';

// Renomeado para ImportPage
export default function ImportPage() { 
    const { 
        navigateTo,
        profile // Precisamos do perfil para mesclar o histórico
    } = useAppContext();
    const [isImporting, setIsImporting] = useState(false);

    /**
     * Pega uma string de repetições (ex: "10-12" ou "15") e retorna o maior valor.
     * @param {string} repString A string de repetições.
     * @return {string} O maior número como string ou a string original.
     */
    const parseRepValue = (repString) => {
        if (!repString || typeof repString !== "string") return "";
        const parts = repString.split("-").map((s) => s.trim());
        const lastValue = parts[parts.length - 1];
        return isNaN(parseInt(lastValue, 10)) ? repString : lastValue;
    };

    const processJsonImport = async (data) => {
        const {
            profile: profileData = {},
            muscleGroups = [],
            exercises = [],
            workouts = [],
            measurementHistory = [],
        } = data;
        
        const userId = auth.currentUser.uid;
        if (!userId) throw new Error("Usuário não autenticado.");

        const groupMap = new Map();
        const exerciseMap = new Map();

        // Pré-carrega os dados existentes para evitar duplicados
        const existingGroupsSnap = await getDocs(collection(db, 'users', userId, 'muscleGroups'));
        existingGroupsSnap.forEach(doc => groupMap.set(doc.data().name, doc.id));
        
        const existingExercisesSnap = await getDocs(collection(db, 'users', userId, 'exercises'));
        existingExercisesSnap.forEach(doc => exerciseMap.set(doc.data().name, doc.id));
        
        // Etapa 1: Processa e cria grupos musculares, incluindo os mencionados nos exercícios
        const allGroupNames = new Set(muscleGroups.map(g => g.name));
        exercises.forEach(ex => {
            if (ex.muscleGroupName) allGroupNames.add(ex.muscleGroupName);
            (ex.secondaryMuscleGroupNames || []).forEach(name => allGroupNames.add(name));
        });
        
        for (const groupName of allGroupNames) {
            if (!groupMap.has(groupName)) {
                const newDocRef = await addDoc(collection(db, 'users', userId, 'muscleGroups'), { name: groupName });
                groupMap.set(groupName, newDocRef.id);
            }
        }

        // Etapa 2: Processa Exercícios
        for (const exercise of exercises) {
            if (!exerciseMap.has(exercise.name)) {
                const muscleGroupId = groupMap.get(exercise.muscleGroupName);
                if (!muscleGroupId) throw new Error(`Grupo '${exercise.muscleGroupName}' não encontrado.`);
                
                const secondaryMuscleGroupIds = (exercise.secondaryMuscleGroupNames || []).map(name => groupMap.get(name)).filter(Boolean);

                const exerciseData = { ...exercise, muscleGroupId, secondaryMuscleGroupIds };
                delete exerciseData.muscleGroupName;
                delete exerciseData.secondaryMuscleGroupNames;

                const newDocRef = await addDoc(collection(db, 'users', userId, 'exercises'), exerciseData);
                exerciseMap.set(exercise.name, newDocRef.id);
            }
        }
        
        // Etapa 3: Processar Treinos
        for (const workout of workouts) {
            const workoutExercises = workout.exercises.map((ex, index) => {
                const exerciseId = exerciseMap.get(ex.exerciseName);
                if (!exerciseId) throw new Error(`Exercício "${ex.exerciseName}" não foi definido na lista principal.`);

                const substituteIds = (ex.substituteExerciseNames || []).map(name => exerciseMap.get(name)).filter(Boolean);
                
                return {
                    exerciseId,
                    substituteIds,
                    sets: ex.sets || '3',
                    reps: parseRepValue(ex.reps) || '12',
                    rest: ex.rest || '60',
                    weight: ex.weight || '',
                    workoutExerciseId: Date.now() + index,
                };
            });
            await addDoc(collection(db, 'users', userId, 'workouts'), { ...workout, exercises: workoutExercises });
        }

        // Etapa 4 e 5: Perfil e Histórico de Medidas
        const finalProfileData = { ...profileData };
        if (measurementHistory.length > 0) {
            const existingHistory = profile?.measurementHistory || [];
            const combined = [...existingHistory, ...measurementHistory];
            const unique = Array.from(new Map(combined.map(item => [item.date, item])).values());
            finalProfileData.measurementHistory = unique.sort((a, b) => new Date(a.date) - new Date(b.date));
        }
        
        if (Object.keys(finalProfileData).length > 0) {
            // Usa 'set' com 'merge' para atualizar ou criar o perfil sem sobrescrever outros campos.
            await setDoc(doc(db, 'users', userId, 'profile', 'data'), finalProfileData, { merge: true });
        }
    };

    const handleFileImport = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsImporting(true);
        try {
            const fileContent = await file.text();
            const data = JSON.parse(fileContent);
            
            // Chama a função de processamento local
            await processJsonImport(data);

            alert("Plano de treino importado com sucesso!");
            navigateTo({ page: 'workouts' });

        } catch (error) {
            console.error("Erro ao importar o arquivo:", error);
            alert(`Falha na importação: ${error.message}`);
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <div className="animate-fade-in max-w-xl mx-auto">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center">
                <UploadCloud size={48} className="mx-auto text-blue-400 mb-4" />
                <h1 className="text-2xl font-semibold text-white mb-2">Importar Plano de Treino</h1>
                <p className="text-gray-400 mb-6">
                    Faça o upload de um arquivo JSON (.json) com a estrutura de treinos, exercícios e medidas para configurar seu perfil automaticamente.
                </p>
                <label className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 px-5 rounded-lg hover:bg-green-700 transition-colors shadow">
                    {isImporting ? 'A importar...' : 'Selecionar Arquivo'}
                    <input 
                        type="file" 
                        className="hidden" 
                        accept=".json" 
                        onChange={handleFileImport}
                        disabled={isImporting}
                    />
                </label>
            </div>
        </div>
    );
}