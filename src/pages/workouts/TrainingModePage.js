import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { ConfirmationModal } from '../../components/modals/ConfirmationModal';
import { InputField } from '../../components/ui/InputField';
import { StopCircle, CheckCircle, TrendingUp, Youtube, Repeat, Plus, Minus, X, ChevronDown } from 'lucide-react';
import YouTubePlayerModal from '../../components/modals/YouTubePlayerModal';
import ImageModal from '../../components/modals/ImageModal';
import HistoryModal from '../../components/modals/HistoryModal';
import AddExerciseToWorkoutModal from '../../components/modals/AddExerciseToWorkoutModal';

// Componente do Temporizador de Descanso
function RestTimer({ duration, onFinish, isRunning, setIsRunning }) {
    const [timeLeft, setTimeLeft] = useState(duration);
    const progress = (timeLeft / duration) * 100;
    const audioRef = useRef(null);

    useEffect(() => {
        if (isRunning) {
            setTimeLeft(duration);
            // Prepara o áudio com uma interação do utilizador
            if (audioRef.current) {
                audioRef.current.load();
            }
        }
    }, [isRunning, duration]);
    
    useEffect(() => {
        if (!isRunning) return;
        if (timeLeft <= 0) {
            if (audioRef.current) {
                audioRef.current.play().catch(e => console.log("Erro ao tocar áudio:", e));
            }
            onFinish();
            return;
        }
        const intervalId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(intervalId);
    }, [timeLeft, isRunning, onFinish]);

    if (!isRunning) return null;

    return (
        <div className="fixed top-0 left-0 right-0 bg-gray-900/90 backdrop-blur-sm p-4 z-50 text-white text-center border-b border-blue-500">
             <audio ref={audioRef} src="https://cdn.pixabay.com/download/audio/2021/08/04/audio_c668156e15.mp3?filename=short-success-sound-glockenspiel-treasure-video-game-2-18634.mp3" preload="auto"></audio>
            <h3 className="font-bold text-lg">Descanso</h3>
            <p className="text-5xl font-mono my-2">{timeLeft}s</p>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 linear" style={{ width: `${progress}%` }}></div>
            </div>
            <button onClick={() => { setIsRunning(false); onFinish(); }} className="mt-4 text-gray-400 text-sm hover:text-white">Pular</button>
        </div>
    );
}

// Componente para cada exercício na lista de treino
function TrainingExerciseItem({ workoutExerciseId, log, isExpanded, onToggleExpand }) {
    const { exercises, history, activeSession, setActiveSession } = useAppContext();
    const [isSubstituteModalOpen, setIsSubstituteModalOpen] = useState(false);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [videoModalUrl, setVideoModalUrl] = useState(null);
    const [imageModalUrl, setImageModalUrl] = useState(null);
    const [historyModalExercise, setHistoryModalExercise] = useState(null);

    const fullExerciseDetails = exercises.find(e => e.id === log.currentExerciseId) || {};
    const originalExerciseDetails = exercises.find(e => e.id === log.originalExerciseId) || {};
    const substitutes = (originalExerciseDetails.substituteIds || []).map(id => exercises.find(e => e.id === id)).filter(Boolean);
    
    const exerciseHasHistory = (exId) => history.some(h => h.exerciseLogs.some(l => l.exerciseId === exId));

    const handleLogChange = (setIndex, field, value) => {
        const newSets = [...log.sets];
        newSets[setIndex][field] = value;
        const newLogs = { ...activeSession.logs, [workoutExerciseId]: { ...log, sets: newSets } };
        setActiveSession(prev => ({...prev, logs: newLogs}));
    };
    
    const toggleSetComplete = (setIndex) => {
        const newSets = [...log.sets];
        const wasCompleted = newSets[setIndex].completed;
        newSets[setIndex].completed = !wasCompleted;
        const newLogs = { ...activeSession.logs, [workoutExerciseId]: { ...log, sets: newSets } };
        setActiveSession(prev => ({...prev, logs: newLogs}));

        if (!wasCompleted) {
            setIsTimerRunning(true);
        }
    };

    const addSet = () => {
        const lastSet = log.sets[log.sets.length - 1] || { reps: '', weight: ''};
        const newSet = { id: Date.now(), reps: lastSet.reps, weight: lastSet.weight, completed: false };
        const newSets = [...log.sets, newSet];
        const newLogs = { ...activeSession.logs, [workoutExerciseId]: { ...log, sets: newSets } };
        setActiveSession(prev => ({...prev, logs: newLogs}));
    };

    const removeSet = (setId) => {
        const newSets = log.sets.filter(s => s.id !== setId);
        const newLogs = { ...activeSession.logs, [workoutExerciseId]: { ...log, sets: newSets } };
        setActiveSession(prev => ({...prev, logs: newLogs}));
    };
    
    const handleSubstitute = (substituteId) => {
        const newLogs = { ...activeSession.logs, [workoutExerciseId]: { ...log, currentExerciseId: substituteId } };
        setActiveSession(prev => ({...prev, logs: newLogs}));
        setIsSubstituteModalOpen(false);
    }
    
    return (
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
            {isSubstituteModalOpen && <AddExerciseToWorkoutModal existingIds={[log.originalExerciseId, ...substitutes.map(s => s.id)]} onAdd={(ids) => handleSubstitute(ids[0])} onClose={() => setIsSubstituteModalOpen(false)} title={`Substituir ${originalExerciseDetails.name}`}/>}
            {videoModalUrl && <YouTubePlayerModal url={videoModalUrl} onClose={() => setVideoModalUrl(null)} />}
            {imageModalUrl && <ImageModal url={imageModalUrl} onClose={() => setImageModalUrl(null)} />}
            {historyModalExercise && <HistoryModal exercise={historyModalExercise} history={history} onClose={() => setHistoryModalExercise(null)} />}
            <RestTimer duration={log.rest} isRunning={isTimerRunning} setIsRunning={setIsTimerRunning} onFinish={() => setIsTimerRunning(false)} />

            <div className="flex gap-4 items-start">
                <img src={fullExerciseDetails.imageUrl || 'https://placehold.co/128x128/1f2937/FFFFFF?text=GYM'} alt={fullExerciseDetails.name} className="w-24 h-24 rounded-md object-cover cursor-pointer" onClick={() => fullExerciseDetails.imageUrl && setImageModalUrl(fullExerciseDetails.imageUrl)}/>
                <div className="flex-grow">
                    <div className="flex justify-between items-center cursor-pointer" onClick={onToggleExpand}>
                        <h3 className="text-xl font-bold text-white">{fullExerciseDetails.name}</h3>
                         <ChevronDown size={24} className={`transition-transform text-blue-400 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                        {substitutes.length > 0 && <button onClick={() => setIsSubstituteModalOpen(true)} className="btn-icon text-gray-400 hover:text-blue-400"><Repeat size={20}/></button>}
                        {exerciseHasHistory(fullExerciseDetails.id) && <button onClick={() => setHistoryModalExercise(fullExerciseDetails)} className="btn-icon text-gray-400 hover:text-green-400"><TrendingUp size={20}/></button>}
                        {fullExerciseDetails.videoUrl && <button onClick={() => setVideoModalUrl(fullExerciseDetails.videoUrl)} className="btn-icon text-gray-400 hover:text-red-500"><Youtube size={20}/></button>}
                    </div>
                </div>
            </div>
            {isExpanded && (
                <div className="mt-4 space-y-2 animate-fade-in">
                    {log.sets.map((set, index) => (
                         <div key={set.id} className={`flex items-center gap-2 p-2 rounded-md ${set.completed ? 'bg-green-900/40' : 'bg-gray-700/50'}`}>
                            <button onClick={() => toggleSetComplete(index)} className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-all ${set.completed ? 'bg-green-500 border-green-400' : 'border-gray-500'}`}>
                               {set.completed && <CheckCircle size={20} className="text-white"/>}
                            </button>
                            <div className="flex-grow grid grid-cols-2 gap-2">
                                <InputField label="Reps" type="number" value={set.reps} onChange={e => handleLogChange(index, 'reps', e.target.value)} small/>
                                <InputField label="Peso (kg)" type="number" value={set.weight} onChange={e => handleLogChange(index, 'weight', e.target.value)} small/>
                            </div>
                            <button onClick={() => removeSet(set.id)} className="btn-icon text-gray-500 hover:text-red-500"><Minus size={20}/></button>
                        </div>
                    ))}
                    <button onClick={addSet} className="w-full flex items-center justify-center gap-2 text-white font-semibold py-2 px-5 rounded-lg border-2 border-gray-600 bg-transparent hover:bg-gray-700 transition-colors mt-2"><Plus size={16}/> Adicionar Série</button>
                </div>
            )}
        </div>
    );
}

export default function TrainingModePage() {
    const { workouts, setWorkouts, exercises, setHistory, activeSession, setActiveSession, navigateTo } = useAppContext();
    const workout = workouts.find(w => w.id === activeSession.workoutId);
    const [expandedExercise, setExpandedExercise] = useState(workout.exercises[0]?.workoutExerciseId);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    
    const finishWorkout = () => {
        const newHistoryEntry = { id: Date.now(), workoutId: workout.id, workoutName: workout.name, completionDate: new Date().toISOString(), exerciseLogs: Object.values(activeSession.logs).map(log => ({ exerciseId: log.currentExerciseId, name: (exercises.find(e=>e.id === log.currentExerciseId) || {}).name, sets: log.sets.length, reps: log.sets[0]?.reps || 0, weight: log.sets[0]?.weight || 0 })) };
        setHistory(prev => [...prev, newHistoryEntry]);
        setWorkouts(prev => prev.map(w => w.id === workout.id ? { ...w, lastCompleted: new Date().toISOString() } : w));
        setActiveSession(null); 
        navigateTo({ page: 'workouts' });
    };

    const confirmCancelWorkout = () => { setActiveSession(null); navigateTo({ page: 'workouts' }); };
    
    if (!workout) return <div className='text-white'>A carregar treino...</div>;
    
    return (
        <div className="animate-fade-in pb-28">
            <ConfirmationModal isOpen={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)} onConfirm={confirmCancelWorkout} title="Cancelar Treino"><p>Tem a certeza que quer cancelar o treino? O progresso não será guardado.</p></ConfirmationModal>
            
            <h1 className="text-3xl font-bold text-white truncate mb-4">{workout.name}</h1>
            <div className="space-y-4">
                {workout.exercises.map(ex => (
                    <TrainingExerciseItem 
                        key={ex.workoutExerciseId} 
                        workoutExerciseId={ex.workoutExerciseId} 
                        log={activeSession.logs[ex.workoutExerciseId]} 
                        isExpanded={expandedExercise === ex.workoutExerciseId}
                        onToggleExpand={() => setExpandedExercise(prev => prev === ex.workoutExerciseId ? null : ex.workoutExerciseId)}
                    />
                ))}
            </div>
             <div className="mt-8 grid grid-cols-2 gap-4">
                 <button onClick={() => setIsCancelModalOpen(true)} className="w-full flex items-center justify-center gap-2 text-blue-400 font-semibold py-3 px-5 rounded-lg border-2 border-blue-600 bg-transparent hover:bg-blue-600/20 transition-colors">
                    <X size={20}/>
                    <span>Cancelar</span>
                </button>
                <button onClick={finishWorkout} className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 px-5 rounded-lg hover:bg-green-700 transition-colors shadow">
                    <StopCircle size={20}/>
                    <span>Finalizar</span>
                </button>
            </div>
        </div>
    );
}
