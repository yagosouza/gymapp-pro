import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { DatabaseZap, FileEdit, Download, Copy, Check, HelpCircle, Upload, ChevronDown, FileJson } from 'lucide-react';
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
3.  Cadastro de Exercícios Substitutos: Se um exercício for mencionado em "substituteExerciseNames" dentro de um treino, certifique-se de que ele também exista na lista principal de "exercises" do JSON. Se não existir, adicione-o à lista "exercises" com pelo menos o campo "name".
4.  Pesquisa de Mídia: Para cada exercício na lista principal "exercises", pesquise na internet, **priorizando resultados em português do Brasil (pt-BR)**, por:
    - "videoUrl": Um link completo e público do YouTube. **Dê preferência a vídeos no formato "Shorts"**, pois são mais diretos. Contudo, se um vídeo normal de alta qualidade for uma demonstração melhor, pode usá-lo. Verifique se o vídeo é acessível globalmente.
    - "imageUrl": Um link DIRETO para uma imagem ou GIF (terminando em .gif, .jpg, .png, etc.). Evite links de páginas web; o link deve ser da própria imagem. Exemplo de link válido: https://media.tenor.com/cy46UbnfUrkAAAAM/eleva%C3%A7%C3%A3o-lateral-hateres.gif
    - Se não encontrar um link válido, deixe o campo como uma string vazia ("").
5.  Dados Ausentes: Se um campo do JSON não tiver uma informação correspondente no PDF, preencha-o com uma string vazia (""), a menos que o modelo sugira outro padrão (como null ou um array vazio []).
6.  Formatação de Dados: Preste muita atenção à formatação para garantir a validade do JSON:
    - Datas: Converta datas do formato DD/MM/AAAA para AAAA-MM-DD.
    - Números Decimais: Utilize o ponto (.) como separador decimal (ex: 86.10).
    - Unidades: NÃO inclua unidades de medida (como "kg", "cm", "min", "s") nos campos de valores.
      - Exemplo Crítico: Para um exercício "Prancha" com duração de "30-40s", o campo "reps" no JSON deve ser "30-40", e não "30-40s".
7.  Saída Final: Sua resposta deve conter APENAS o bloco de código com o JSON finalizado. O JSON deve ser completo e sintaticamente válido, sem comentários, citações ou texto explicativo dentro dele.`;

export default function ImportPage() {
    const { navigateTo, profile } = useAppContext();
    const [isImporting, setIsImporting] = useState(false);
    const [jsonContent, setJsonContent] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const [isModelCopied, setIsModelCopied] = useState(false);
    const [clearDatabase, setClearDatabase] = useState(false);
    const [conflictStrategy, setConflictStrategy] = useState('overwrite');
    const [isOptionsVisible, setIsOptionsVisible] = useState(false);

    const helperButtonBaseStyle = "w-full flex items-center justify-center gap-2 text-white font-semibold py-3 px-5 rounded-lg transition-colors shadow";

    const handleCopyPrompt = () => {
        navigator.clipboard.writeText(PROMPT_TEXT).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };
    
    const handleCopyModel = () => {
        navigator.clipboard.writeText(JSON.stringify(modelData, null, 2)).then(() => {
            setIsModelCopied(true);
            setTimeout(() => setIsModelCopied(false), 2000);
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
            measurementHistory: importMeasurementHistory = [],
        } = data;

        const userId = auth.currentUser.uid;
        if (!userId) throw new Error("Usuário não autenticado.");

        const batch = writeBatch(db);
        
        if (clearDatabase) {
            const collectionsToDelete = ['workouts', 'exercises', 'muscleGroups', 'history'];
            for(const col of collectionsToDelete) {
                 const snap = await getDocs(collection(db, 'users', userId, col));
                 snap.forEach(document => batch.delete(document.ref));
            }
            batch.update(doc(db, 'users', userId, 'profile', 'data'), { measurementHistory: [] });
        }

        const groupMap = new Map();
        const exerciseMap = new Map();
        const workoutMap = new Map();

        if (!clearDatabase) {
            const groupsSnap = await getDocs(collection(db, 'users', userId, 'muscleGroups'));
            groupsSnap.forEach(doc => groupMap.set(doc.data().name.toLowerCase(), doc.id));
            
            const exercisesSnap = await getDocs(collection(db, 'users', userId, 'exercises'));
            exercisesSnap.forEach(doc => exerciseMap.set(doc.data().name.toLowerCase(), doc.id));

            const workoutsSnap = await getDocs(collection(db, 'users', userId, 'workouts'));
            workoutsSnap.forEach(doc => workoutMap.set(doc.data().name.toLowerCase(), doc.id));
        }

        const allGroupNames = new Set();
        importMuscleGroups.forEach(g => allGroupNames.add(g.name));
        importExercises.forEach(ex => {
            if (ex.muscleGroupName) allGroupNames.add(ex.muscleGroupName);
            (ex.secondaryMuscleGroupNames || []).forEach(name => allGroupNames.add(name));
        });
        
        for (const groupName of allGroupNames) {
            if (groupName && !groupMap.has(groupName.toLowerCase())) {
                const newDocRef = doc(collection(db, 'users', userId, 'muscleGroups'));
                batch.set(newDocRef, { name: groupName });
                groupMap.set(groupName.toLowerCase(), newDocRef.id);
            }
        }

        const allExercisesToProcess = new Map();
        for (const exercise of importExercises) {
            if (exercise.name && !allExercisesToProcess.has(exercise.name.toLowerCase())) {
                allExercisesToProcess.set(exercise.name.toLowerCase(), exercise);
            }
        }
        for (const workout of importWorkouts) {
            for (const woExercise of workout.exercises) {
                if (woExercise.exerciseName && !allExercisesToProcess.has(woExercise.exerciseName.toLowerCase())) {
                    allExercisesToProcess.set(woExercise.exerciseName.toLowerCase(), { 
                        name: woExercise.exerciseName,
                        suggestedSets: woExercise.sets,
                        suggestedReps: woExercise.reps,
                        suggestedWeight: woExercise.weight,
                        suggestedRest: woExercise.rest,
                    });
                }
                for (const subName of (woExercise.substituteExerciseNames || [])) {
                    if (subName && !allExercisesToProcess.has(subName.toLowerCase())) {
                        allExercisesToProcess.set(subName.toLowerCase(), { name: subName });
                    }
                }
            }
        }

        for (const exercise of allExercisesToProcess.values()) {
            if (!exerciseMap.has(exercise.name.toLowerCase())) {
                const muscleGroupId = groupMap.get(exercise.muscleGroupName?.toLowerCase()) || null;
                const secondaryMuscleGroupIds = (exercise.secondaryMuscleGroupNames || []).map(name => groupMap.get(name?.toLowerCase())).filter(Boolean);

                const newDocRef = doc(collection(db, 'users', userId, 'exercises'));
                const exerciseData = {
                    name: exercise.name, muscleGroupId, secondaryMuscleGroupIds,
                    videoUrl: exercise.videoUrl || '', imageUrl: exercise.imageUrl || '',
                    suggestedSets: exercise.suggestedSets || '', suggestedReps: exercise.suggestedReps || '',
                    suggestedWeight: exercise.suggestedWeight || '', suggestedRest: exercise.suggestedRest || '60',
                };
                batch.set(newDocRef, exerciseData);
                exerciseMap.set(exercise.name.toLowerCase(), newDocRef.id);
            }
        }
        
        for (const workout of importWorkouts) {
            const workoutExercises = (workout.exercises || []).map((ex, index) => {
                const exerciseId = exerciseMap.get(ex.exerciseName?.toLowerCase());
                if (!exerciseId) {
                    console.warn(`Exercício '${ex.exerciseName}' para o treino '${workout.name}' não encontrado. Pulando item do treino.`);
                    return null;
                };
                const substituteIds = (ex.substituteExerciseNames || []).map(name => exerciseMap.get(name?.toLowerCase())).filter(Boolean);
                
                return {
                    exerciseId, substituteIds, sets: ex.sets || '3',
                    reps: parseRepValue(ex.reps) || '12', rest: ex.rest || '60',
                    weight: ex.weight || '', workoutExerciseId: Date.now() + index,
                };
            }).filter(Boolean);

            const workoutData = { name: workout.name, exercises: workoutExercises, createdAt: new Date().toISOString() };
            const existingWorkoutId = workoutMap.get(workout.name.toLowerCase());

            if (existingWorkoutId) {
                if (conflictStrategy === 'overwrite') batch.set(doc(db, 'users', userId, 'workouts', existingWorkoutId), workoutData);
            } else {
                batch.set(doc(collection(db, 'users', userId, 'workouts')), workoutData);
            }
        }

        const finalProfileData = { ...profileData };
        if (importMeasurementHistory.length > 0) {
            const existingHistory = profile?.measurementHistory || [];
            const combined = [...existingHistory, ...importMeasurementHistory];
            const unique = Array.from(new Map(combined.map(item => [item.date, item])).values());
            finalProfileData.measurementHistory = unique.sort((a, b) => new Date(a.date) - new Date(b.date));
        }
        
        if (Object.keys(finalProfileData).length > 0) {
            batch.set(doc(db, 'users', userId, 'profile', 'data'), finalProfileData, { merge: true });
        }

        await batch.commit();
    };

    const startImport = async (content) => {
        if (!content.trim()) {
            alert("Por favor, cole o conteúdo JSON ou selecione um arquivo.");
            return;
        }
        setIsImporting(true);
        try {
            const data = JSON.parse(content);
            await processJsonImport(data, { clearDatabase, conflictStrategy });
            alert("Importação concluída com sucesso!");
            navigateTo({ page: 'home' });
        } catch (error) {
            console.error("Erro ao importar dados:", error);
            alert(`Falha na importação: ${error.message}. Verifique o formato do JSON.`);
        } finally {
            setIsImporting(false);
        }
    };

    const handleFileSelected = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const text = await file.text();
        setJsonContent(text);
    };
    
    const handlePasteImport = async () => {
        await startImport(jsonContent);
    };

    return (
        <>
            <LoadingOverlay isActive={isImporting} message="A importar dados..." />
            <div className="animate-fade-in max-w-xl mx-auto space-y-6 mb-8">
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <HelpCircle size={20} className="text-blue-400"/>
                        Como Importar Dados
                    </h3>
                    <p className="text-sm text-gray-400">
                       Não tem um arquivo JSON? Baixe nosso modelo, use o prompt para preenchê-lo com sua IA favorita e cole o resultado abaixo.
                    </p>
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={handleCopyModel} className={`${helperButtonBaseStyle} ${isModelCopied ? 'bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                {isModelCopied ? <Check size={20}/> : <FileJson size={20}/>}
                                {isModelCopied ? 'Copiado!' : 'Copiar Modelo'}
                            </button>
                            <button onClick={handleCopyPrompt} className={`${helperButtonBaseStyle} ${isCopied ? 'bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                {isCopied ? <Check size={20}/> : <Copy size={20}/>}
                                {isCopied ? 'Copiado!' : 'Prompt para IA'}
                            </button>
                        </div>
                        <div>
                            <button onClick={handleDownloadModel} className={`${helperButtonBaseStyle} bg-green-600 hover:bg-green-700`}>
                                <Download size={20}/>
                                Baixar Modelo
                            </button>
                        </div>
                    </div>
                </div>

                 <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center">
                    <h1 className="text-2xl font-semibold text-white mb-4">Cole o JSON para Importar</h1>
                     <textarea
                        className="w-full h-48 p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-white font-mono text-sm"
                        value={jsonContent}
                        onChange={(e) => setJsonContent(e.target.value)}
                        placeholder="Cole aqui o conteúdo do seu JSON de treino..."
                    />
                    <div className="mt-4 flex flex-col sm:flex-row gap-4">
                        <label className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 px-5 rounded-lg hover:bg-green-700 transition-colors shadow cursor-pointer">
                            <Upload size={20}/>
                            {'Selecionar Arquivo'}
                            <input 
                                type="file" 
                                className="hidden" 
                                accept=".json" 
                                onChange={handleFileSelected}
                                disabled={isImporting}
                            />
                        </label>
                        <button onClick={handlePasteImport} disabled={isImporting || !jsonContent.trim()} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-5 rounded-lg hover:bg-blue-700 transition-colors shadow disabled:opacity-50">
                            Importar Dados
                        </button>
                    </div>
                 </div>

                <div className="bg-gray-800 rounded-xl shadow-lg">
                    <button
                        onClick={() => setIsOptionsVisible(!isOptionsVisible)}
                        className="w-full flex justify-between items-center text-left p-6"
                    >
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2"><DatabaseZap size={20} className="text-blue-400"/>Opções de Importação</h3>
                        <ChevronDown size={24} className={`transition-transform text-blue-400 ${isOptionsVisible ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isOptionsVisible && (
                        <div className="px-6 pb-6 space-y-6 animate-fade-in">
                             <div>
                                <div className="flex items-center justify-between mt-4 bg-gray-700 p-3 rounded-lg">
                                    <label htmlFor="clear-db" className="font-medium text-gray-200">Limpar dados antes de importar?</label>
                                    <button
                                        id="clear-db"
                                        role="switch"
                                        aria-checked={clearDatabase}
                                        onClick={() => setClearDatabase(!clearDatabase)}
                                        className={`${clearDatabase ? 'bg-red-600' : 'bg-gray-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                                    >
                                        <span className={`${clearDatabase ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Atenção: Esta ação removerá permanentemente todos os seus treinos, exercícios e grupos musculares atuais antes da importação.</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2"><FileEdit size={20} className="text-blue-400"/>Conflito de Nomes de Treino</h3>
                                <div className="mt-4 space-y-2">
                                     <label className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${conflictStrategy === 'overwrite' ? 'bg-blue-600/30 border border-blue-500' : 'bg-gray-700'}`}>
                                        <input type="radio" name="conflict" value="overwrite" checked={conflictStrategy === 'overwrite'} onChange={(e) => setConflictStrategy(e.target.value)} className="hidden" />
                                        <div>
                                            <p className="font-semibold">Sobrescrever</p>
                                            <p className="text-sm text-gray-400">Se um treino com o mesmo nome já existe, será substituído pelo do arquivo.</p>
                                        </div>
                                    </label>
                                    <label className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${conflictStrategy === 'skip' ? 'bg-blue-600/30 border border-blue-500' : 'bg-gray-700'}`}>
                                        <input type="radio" name="conflict" value="skip" checked={conflictStrategy === 'skip'} onChange={(e) => setConflictStrategy(e.target.value)} className="hidden"/>
                                        <div>
                                            <p className="font-semibold">Ignorar</p>
                                            <p className="text-sm text-gray-400">Se um treino com o mesmo nome já existe, ele será mantido e o do arquivo não será importado.</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
