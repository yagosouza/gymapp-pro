import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { UploadCloud, DatabaseZap, FileEdit } from 'lucide-react';
import { collection, getDocs, writeBatch, doc } from "firebase/firestore";
import { auth, db } from '../../firebase/config';
import { LoadingOverlay } from '../../components/ui/LoadingOverlay';

export default function ImportPage() {
    const { navigateTo, profile } = useAppContext();
    const [isImporting, setIsImporting] = useState(false);

    const [clearDatabase, setClearDatabase] = useState(false);
    const [conflictStrategy, setConflictStrategy] = useState('overwrite'); // 'overwrite' ou 'skip'

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

    const processJsonImport = async (data, options) => {
        const { clearDatabase, conflictStrategy } = options;
        const {
            profile: profileData = {},
            muscleGroups: importMuscleGroups = [],
            exercises: importExercises = [],
            workouts: importWorkouts = [],
            measurementHistory = [],
        } = data;

        const userId = auth.currentUser.uid;
        if (!userId) throw new Error("Usuário não autenticado.");

        const batch = writeBatch(db);
        
        // --- ETAPA 1: DELEÇÃO (SE SOLICITADO) ---
        if (clearDatabase) {
            // Busca os documentos atuais para deletá-los
            const workoutsSnap = await getDocs(collection(db, 'users', userId, 'workouts'));
            workoutsSnap.forEach(document => batch.delete(document.ref));
            
            const exercisesSnap = await getDocs(collection(db, 'users', userId, 'exercises'));
            exercisesSnap.forEach(document => batch.delete(document.ref));

            const groupsSnap = await getDocs(collection(db, 'users', userId, 'muscleGroups'));
            groupsSnap.forEach(document => batch.delete(document.ref));
        }

        // --- ETAPA 2: PREPARAR MAPAS DE DADOS EXISTENTES (SE NÃO FOR LIMPAR) ---
        const groupMap = new Map();
        const exerciseMap = new Map();
        const workoutMap = new Map();

        if (!clearDatabase) {
            const groupsSnap = await getDocs(collection(db, 'users', userId, 'muscleGroups'));
            groupsSnap.forEach(doc => groupMap.set(doc.data().name, doc.id));
            
            const exercisesSnap = await getDocs(collection(db, 'users', userId, 'exercises'));
            exercisesSnap.forEach(doc => exerciseMap.set(doc.data().name, doc.id));

            const workoutsSnap = await getDocs(collection(db, 'users', userId, 'workouts'));
            workoutsSnap.forEach(doc => workoutMap.set(doc.data().name, doc.id));
        }

        // --- ETAPA 3: CRIAR GRUPOS MUSCULARES ---
        const allGroupNames = new Set(importMuscleGroups.map(g => g.name));
        importExercises.forEach(ex => {
            if (ex.muscleGroupName) allGroupNames.add(ex.muscleGroupName);
            (ex.secondaryMuscleGroupNames || []).forEach(name => allGroupNames.add(name));
        });
        
        for (const groupName of allGroupNames) {
            if (!groupMap.has(groupName)) {
                const newDocRef = doc(collection(db, 'users', userId, 'muscleGroups'));
                batch.set(newDocRef, { name: groupName });
                groupMap.set(groupName, newDocRef.id); // Adiciona o novo grupo ao mapa para uso futuro
            }
        }

        // --- ETAPA 4: CRIAR EXERCÍCIOS ---
        for (const exercise of importExercises) {
            if (!exerciseMap.has(exercise.name)) {
                const muscleGroupId = groupMap.get(exercise.muscleGroupName);
                // Validação para pular exercícios cujo grupo principal não foi encontrado
                if (!muscleGroupId) continue; 
                
                const secondaryMuscleGroupIds = (exercise.secondaryMuscleGroupNames || []).map(name => groupMap.get(name)).filter(Boolean);

                const newDocRef = doc(collection(db, 'users', userId, 'exercises'));
                batch.set(newDocRef, {
                    name: exercise.name,
                    muscleGroupId,
                    secondaryMuscleGroupIds,
                    videoUrl: exercise.videoUrl || '',
                    imageUrl: exercise.imageUrl || ''
                });
                exerciseMap.set(exercise.name, newDocRef.id); // Adiciona o novo exercício ao mapa
            }
        }
        
        // --- ETAPA 5: CRIAR TREINOS (COM LÓGICA DE CONFLITO) ---
        for (const workout of importWorkouts) {
            const workoutExercises = (workout.exercises || []).map((ex, index) => {
                const exerciseId = exerciseMap.get(ex.exerciseName);
                if (!exerciseId) return null;

                const substituteIds = (ex.substituteExerciseNames || []).map(name => exerciseMap.get(name)).filter(Boolean);
                
                return {
                    exerciseId, substituteIds,
                    sets: ex.sets || '3',
                    reps: parseRepValue(ex.reps) || '12',
                    rest: ex.rest || '60',
                    weight: ex.weight || '',
                    workoutExerciseId: Date.now() + index,
                };
            }).filter(Boolean);

            const workoutData = { name: workout.name, exercises: workoutExercises };
            const existingWorkoutId = workoutMap.get(workout.name);

            if (existingWorkoutId) {
                if (conflictStrategy === 'overwrite') {
                    batch.set(doc(db, 'users', userId, 'workouts', existingWorkoutId), workoutData);
                }
            } else {
                batch.set(doc(collection(db, 'users', userId, 'workouts')), workoutData);
            }
        }

        // --- ETAPA 6: ATUALIZAR PERFIL E HISTÓRICO ---
        const finalProfileData = { ...profileData };
        if (measurementHistory.length > 0) {
            const existingHistory = profile?.measurementHistory || [];
            const combined = [...existingHistory, ...measurementHistory];
            const unique = Array.from(new Map(combined.map(item => [item.date, item])).values());
            finalProfileData.measurementHistory = unique.sort((a, b) => new Date(a.date) - new Date(b.date));
        }
        
        if (Object.keys(finalProfileData).length > 0) {
            batch.set(doc(db, 'users', userId, 'profile', 'data'), finalProfileData, { merge: true });
        }

        await batch.commit();
    };

    const handleFileImport = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsImporting(true);
        try {
            const fileContent = await file.text();
            const data = JSON.parse(fileContent);
            
            await processJsonImport(data, { clearDatabase, conflictStrategy });

            alert("Importação concluída com sucesso!");
            navigateTo({ page: 'home' }); // Navegar para a home para forçar a recarga dos dados

        } catch (error) {
            console.error("Erro ao importar o arquivo:", error);
            alert(`Falha na importação: ${error.message}`);
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <>
            <LoadingOverlay isActive={isImporting} message="A importar dados..." />
            <div className="animate-fade-in max-w-xl mx-auto space-y-6">
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center">
                    <UploadCloud size={48} className="mx-auto text-blue-400 mb-4" />
                    <h1 className="text-2xl font-semibold text-white mb-2">Importar Plano de Treino</h1>
                    <p className="text-gray-400 mb-6">
                        Faça o upload de um arquivo JSON para configurar seu perfil. Escolha as opções de importação abaixo.
                    </p>
                    <label className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 px-5 rounded-lg hover:bg-green-700 transition-colors shadow cursor-pointer">
                        {'Selecionar Arquivo'}
                        <input 
                            type="file" 
                            className="hidden" 
                            accept=".json" 
                            onChange={handleFileImport}
                            disabled={isImporting}
                        />
                    </label>
                </div>
                
                {/* --- NOVOS CONTROLES DE OPÇÕES --- */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2"><DatabaseZap size={20} className="text-blue-400"/>Opções de Importação</h3>
                        <div className="flex items-center justify-between mt-4 bg-gray-700 p-3 rounded-lg">
                            <label htmlFor="clear-db" className="font-medium text-gray-200">Limpar dados antes de importar?</label>
                            <button
                                id="clear-db"
                                role="switch"
                                aria-checked={clearDatabase}
                                onClick={() => setClearDatabase(!clearDatabase)}
                                className={`${
                                    clearDatabase ? 'bg-red-600' : 'bg-gray-600'
                                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                            >
                                <span
                                    className={`${
                                    clearDatabase ? 'translate-x-6' : 'translate-x-1'
                                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Atenção: Esta ação removerá permanentemente todos os seus treinos, exercícios e grupos musculares atuais antes da importação. Esta ação não pode ser desfeita.</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2"><FileEdit size={20} className="text-blue-400"/>Conflito de Nomes de Treino</h3>
                        <div className="mt-4 space-y-2">
                             <label className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${conflictStrategy === 'overwrite' ? 'bg-blue-600/30 border border-blue-500' : 'bg-gray-700'}`} >
                                <input type="radio" name="conflict" value="overwrite" checked={conflictStrategy === 'overwrite'} onChange={(e) => setConflictStrategy(e.target.value)} className="hidden" />
                                <div>
                                    <p className="font-semibold">Sobrescrever</p>
                                    <p className="text-sm text-gray-400">Se um treino com o mesmo nome já existe, ele será substituído pelo do arquivo.</p>
                                </div>
                            </label>
                            <label className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${conflictStrategy === 'skip' ? 'bg-blue-600/30 border border-blue-500' : 'bg-gray-700'}`} >
                                <input type="radio" name="conflict" value="skip" checked={conflictStrategy === 'skip'} onChange={(e) => setConflictStrategy(e.target.value)} className="hidden"/>
                                <div>
                                    <p className="font-semibold">Ignorar</p>
                                    <p className="text-sm text-gray-400">Se um treino com o mesmo nome já existe, ele será mantido e o do arquivo não será importado.</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}