import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { UploadCloud, DatabaseZap, FileEdit, Download, Copy, Check, HelpCircle } from 'lucide-react';
import { collection, getDocs, writeBatch, doc } from "firebase/firestore";
import { auth, db } from '../../firebase/config';
import { LoadingOverlay } from '../../components/ui/LoadingOverlay';
import modelData from '../../constants/importData.json';

const PROMPT_TEXT = `Você é um assistente de extração e transformação de dados.

Sua tarefa principal é analisar o conteúdo de um ou mais arquivos PDF e convertê-lo para uma estrutura JSON específica, fornecida em um arquivo modelo.

Arquivos Fornecidos:
1.  PDF(s) de Dados: Contêm as informações a serem extraídas.
2.  modelo.json: Um arquivo JSON que serve como modelo ESTRITO para a estrutura de saída.

Regras de Execução:
1.  Estrutura Rígida: Siga EXATAMENTE a estrutura do arquivo modelo.json. Use os mesmos nomes de chave e a mesma organização (objetos, arrays, etc.).
2.  Mapeamento de Dados: Mapeie cuidadosamente as informações dos PDFs para os campos correspondentes na estrutura JSON.
3.  Dados Ausentes: Se um campo do JSON não tiver uma informação correspondente no PDF, preencha-o com uma string vazia (""), a menos que o modelo sugira outro padrão (como null ou um array vazio []).
4.  Formatação de Dados: Preste muita atenção à formatação para garantir a validade do JSON:
    - Datas: Converta datas do formato DD/MM/AAAA para AAAA-MM-DD, conforme o modelo.
    - Números Decimais: Utilize o ponto (.) como separador decimal, não a vírgula (ex: 86.10).
    - Unidades: NÃO inclua unidades de medida (como "kg", "cm", "min", "s") nos campos de valores. O nome do campo ou o contexto já devem ser suficientes.
      - Exemplo Crítico: Para um exercício como "Prancha" com duração de "30-40s", o campo reps no JSON deve ser "30-40", e não "30-40s".
5.  Saída Final: Sua resposta deve conter APENAS o bloco de código com o JSON finalizado. O JSON deve ser completo e sintaticamente válido, sem comentários, citações ou texto explicativo dentro dele.`;

export default function ImportPage() {
    const { navigateTo, profile } = useAppContext();
    const [isImporting, setIsImporting] = useState(false);

    const [clearDatabase, setClearDatabase] = useState(false);
    const [conflictStrategy, setConflictStrategy] = useState('overwrite'); // 'overwrite' ou 'skip'
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyPrompt = () => {
        navigator.clipboard.writeText(PROMPT_TEXT).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    const handleDownloadModel = () => {
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(modelData, null, 2)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = "modelo_treino.json";
        link.click();
    };

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

                <div className="bg-gray-800 p-6 rounded-xl shadow-lg space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <HelpCircle size={20} className="text-blue-400"/>
                        Como Criar seu Arquivo de Importação
                    </h3>
                    <p className="text-sm text-gray-400">
                        Não tem um arquivo JSON? Sem problemas. Baixe nosso modelo, envie para sua IA favorita (ChatGPT, Gemini, etc.) junto com o PDF do seu treino e peça para ela preenchê-lo para você.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button onClick={handleDownloadModel} className="w-full flex items-center justify-center gap-2 btn-secondary">
                            <Download size={18}/>
                            Baixar Modelo
                        </button>
                        <button onClick={handleCopyPrompt} className={`w-full flex items-center justify-center gap-2 btn-secondary ${isCopied ? 'bg-green-600/80 hover:bg-green-600/80' : ''}`}>
                            {isCopied ? <Check size={18}/> : <Copy size={18}/>}
                            {isCopied ? 'Prompt Copiado!' : 'Copiar Prompt para IA'}
                        </button>
                    </div>
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