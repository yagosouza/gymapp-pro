import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { ConfirmationModal } from '../../components/modals/ConfirmationModal';
import { InputField } from '../../components/ui/InputField';
// 👇 6. Adicionado o ícone Undo2 para a função de reverter
import { StopCircle, CheckCircle, TrendingUp, Youtube, Repeat, Plus, Minus, X, ChevronDown, Undo2 } from 'lucide-react';
import YouTubePlayerModal from '../../components/modals/YouTubePlayerModal';
import ImageModal from '../../components/modals/ImageModal';
import HistoryModal from '../../components/modals/HistoryModal';
import AddExerciseToWorkoutModal from '../../components/modals/AddExerciseToWorkoutModal';

// Componente do Temporizador de Descanso (VERSÃO MELHORADA)
function RestTimer({ duration, onFinish }) {
    const [timeLeft, setTimeLeft] = useState(duration);
    const audioRef = useRef(null);
    const timerId = useRef(null);

    useEffect(() => {
        setTimeLeft(duration);
        
        const playSoundAndNotify = () => {
            if(audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(() => {});
            }
            onFinish(); // Chama a função do pai que dispara notificação e vibração
        };

        if (timerId.current) {
            clearInterval(timerId.current);
        }

        timerId.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerId.current);
                    playSoundAndNotify();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerId.current);
    }, [duration, onFinish]);

    const handleAdjustTime = (amount) => {
        setTimeLeft(prev => Math.max(0, prev + amount));
    };

    const progress = (timeLeft / duration) * 100;
    
    // 👇 4. Estilo para respeitar a safe area em telas edge-to-edge
    const safeAreaStyles = {
        paddingTop: `calc(1rem + env(safe-area-inset-top))`,
        paddingLeft: `calc(1rem + env(safe-area-inset-left))`,
        paddingRight: `calc(1rem + env(safe-area-inset-right))`,
        paddingBottom: '1rem'
    };

    return (
        <div 
            className="fixed top-0 left-0 right-0 bg-gray-900/90 backdrop-blur-sm z-50 text-white text-center border-b border-blue-500"
            style={safeAreaStyles} // Aplicando o estilo da safe area
        >
             <audio ref={audioRef} src="https://cdn.pixabay.com/download/audio/2021/08/04/audio_c668156e15.mp3?filename=short-success-sound-glockenspiel-treasure-video-game-2-18634.mp3" preload="auto"></audio>
            <div className="flex justify-between items-center">
                 <button onClick={() => handleAdjustTime(-15)} className="text-lg font-mono p-2">-15s</button>
                 <div>
                    <h3 className="font-bold text-lg">Descanso</h3>
                    <p className="text-5xl font-mono my-1">{timeLeft}s</p>
                 </div>
                 <button onClick={() => handleAdjustTime(15)} className="text-lg font-mono p-2">+15s</button>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 linear" style={{ width: `${progress}%` }}></div>
            </div>
            <button onClick={onFinish} className="mt-4 text-gray-400 text-sm hover:text-white">Pular</button>
        </div>
    );
}

// Componente para cada exercício na lista de treino (VERSÃO MELHORADA)
function TrainingExerciseItem({ 
    workoutExercise, 
    workoutExerciseId, 
    log, 
    isExpanded, 
    onToggleExpand, 
    onSetComplete, 
    onShowHistory, 
    onShowVideo, 
    onShowImage, 
    onShowSubstitutes 
}) {
    const { exercises, history, activeSession, setActiveSession } = useAppContext();

    const fullExerciseDetails = exercises.find(e => e.id === log.currentExerciseId) || {};
    const exerciseHasHistory = (exId) => history.some(h => h.exerciseLogs.some(l => l.exerciseId === exId));

    const isCompleted = log.sets.length > 0 && log.sets.every(s => s.completed);
    const isSubstituted = log.currentExerciseId !== log.originalExerciseId;

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
            onSetComplete(log.rest);
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

    // 👇 6. Nova função para reverter a substituição
    const handleRevertSubstitution = () => {
        const newLogs = { ...activeSession.logs, [workoutExerciseId]: { ...log, currentExerciseId: log.originalExerciseId } };
        setActiveSession(prev => ({...prev, logs: newLogs}));
    }
    
    return (
        <div className={`bg-gray-800 rounded-xl shadow-lg relative transition-opacity ${isCompleted ? 'opacity-70' : ''}`}>
            {/* 👇 3. Novo Overlay para exercício concluído */}
            {isCompleted && (
            <div className="absolute bottom-3 right-3 bg-green-500 rounded-full p-1 z-10">
                <CheckCircle size={20} className="text-white"/>
            </div>
            )}
            {/* A opacidade agora é aplicada aqui, para não afetar o overlay */}
            <div className={`p-4 transition-opacity duration-300 ${isCompleted ? 'opacity-40' : 'opacity-100'}`}>
                <div className="flex gap-4 items-start">
                    <img src={fullExerciseDetails.imageUrl || 'https://placehold.co/128x128/1f2937/FFFFFF?text=GYM'} alt={fullExerciseDetails.name} className="w-24 h-24 rounded-md object-cover cursor-pointer" onClick={onShowImage}/>
                    <div className="flex-grow">
                        <div className="flex justify-between items-center cursor-pointer" onClick={onToggleExpand}>
                            <h3 className="text-xl font-bold text-white">{fullExerciseDetails.name}</h3>
                             <ChevronDown size={28} className={`transition-transform text-blue-400 ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                             {/* 👇 6. Botão de Reverter aparece se o exercício foi substituído */}
                            {isSubstituted && <button onClick={handleRevertSubstitution} className="btn-icon text-gray-400 hover:text-yellow-400" title="Reverter para o original"><Undo2 size={24}/></button>}
                            
                            {(workoutExercise.substituteIds || []).length > 0 && <button onClick={onShowSubstitutes} className="btn-icon text-gray-400 hover:text-blue-400"><Repeat size={24}/></button>}
                            {exerciseHasHistory(fullExerciseDetails.id) && <button onClick={onShowHistory} className="btn-icon text-gray-400 hover:text-green-400"><TrendingUp size={24}/></button>}
                            {fullExerciseDetails.videoUrl && <button onClick={onShowVideo} className="btn-icon text-gray-400 hover:text-red-500"><Youtube size={24}/></button>}
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
        </div>
    );
}

export default function TrainingModePage() {
    const { workouts, setWorkouts, exercises, setHistory, activeSession, history, setActiveSession, navigateTo } = useAppContext();
    const workout = workouts.find(w => w.id === activeSession?.workoutId);
    
    // 👇 2. A função 'findFirstUncompletedExerciseId' não é mais necessária e foi removida.

    const [expandedExercise, setExpandedExercise] = useState(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [timerState, setTimerState] = useState({ isRunning: false, duration: 60 });

    const [historyModalExercise, setHistoryModalExercise] = useState(null)
    const [activeVideoUrl, setActiveVideoUrl] = useState(null);
    const [activeImageUrl, setActiveImageUrl] = useState(null);
    const [substituteModalInfo, setSubstituteModalInfo] = useState(null);

    useEffect(() => {
            setTimeout(() => window.scrollTo(0, 0), 50); // 50ms é um delay seguro

    const findNextActiveExerciseId = () => {
        if (!workout || !activeSession) return null;
        // Encontra o primeiro exercício que não está 100% completo
        const nextExercise = workout.exercises.find(ex => {
            const log = activeSession.logs[ex.workoutExerciseId];
            return log && !log.sets.every(s => s.completed);
        });
        return nextExercise?.workoutExerciseId || null; // Retorna null se todos estiverem concluídos
    };

    setExpandedExercise(findNextActiveExerciseId());
    }, [workout, activeSession]); // Depende do activeSession para reavaliar ao voltar para a tela

    
    const handleSetComplete = (restDuration, workoutExerciseId) => {
    setTimerState({ isRunning: true, duration: Number(restDuration) || 60 });

    // Verifica se o exercício recém-concluído está completo
    const log = activeSession.logs[workoutExerciseId];
    if (log && log.sets.every(s => s.completed)) {
        setExpandedExercise(null); // Recolhe o exercício atual
    }
    };

    // 👇 5. FUNÇÃO PARA NOTIFICAR E VIBRAR AO FIM DO TIMER
    const handleTimerFinish = () => {
        setTimerState({ isRunning: false, duration: 60 });

        // Vibração (se suportada)
        if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]); // Vibra, pausa, vibra
        }

        // Notificação (se permitida)
        if ('Notification' in window && Notification.permission === 'permission') {
            new Notification('Descanso finalizado!', {
                body: 'Hora de voltar ao treino!',
                icon: '/logo192.png' // Opcional: use o caminho para um ícone do seu app
            });
        }
    };
    
    const finishWorkout = () => {
        const newHistoryEntry = { id: Date.now(), workoutId: workout.id, workoutName: workout.name, completionDate: new Date().toISOString(), exerciseLogs: Object.values(activeSession.logs).map(log => ({ exerciseId: log.currentExerciseId, name: (exercises.find(e=>e.id === log.currentExerciseId) || {}).name, sets: log.sets.length, reps: log.sets[0]?.reps || 0, weight: log.sets[0]?.weight || 0 })) };
        setHistory(prev => [...prev, newHistoryEntry]);
        setWorkouts(prev => prev.map(w => w.id === workout.id ? { ...w, lastCompleted: new Date().toISOString() } : w));
        setActiveSession(null); 
        navigateTo({ page: 'workouts' });
    };

    const confirmCancelWorkout = () => { setActiveSession(null); navigateTo({ page: 'workouts' }); };
    
    const handleSubstitute = (selectedIds) => {
        if (!selectedIds || selectedIds.length === 0 || !substituteModalInfo) return;
        const workoutExerciseId = substituteModalInfo.workoutExerciseId;
        const newLogs = { ...activeSession.logs, [workoutExerciseId]: { ...activeSession.logs[workoutExerciseId], currentExerciseId: selectedIds[0] } };
        setActiveSession(prev => ({...prev, logs: newLogs}));
        setSubstituteModalInfo(null);
    }

    let substituteModalProps = null;
    if (substituteModalInfo) {
        const { workoutExercise } = substituteModalInfo;
        const originalExerciseDetails = exercises.find(e => e.id === workoutExercise.originalExerciseId) || {};
        const substitutes = (workoutExercise.substituteIds || []).map(id => exercises.find(e => e.id === id)).filter(Boolean);
        substituteModalProps = {
            onAdd: handleSubstitute,
            onClose: () => setSubstituteModalInfo(null),
            title: `Substituir ${originalExerciseDetails.name}`,
            isSingleSelection: true,
            allowedIds: substitutes.map(s => s.id)
        }
    }

    return (
        <>
            {/* 👇 5. Passando a nova função 'handleTimerFinish' para o onFinish */}
            {timerState.isRunning && <RestTimer duration={timerState.duration} onFinish={handleTimerFinish} />}
            
            {/* Modais renderizados no topo para evitar problemas de posicionamento */}
            {historyModalExercise && <HistoryModal exercise={historyModalExercise} history={history} onClose={() => setHistoryModalExercise(null)} />}
            {activeVideoUrl && <YouTubePlayerModal url={activeVideoUrl} onClose={() => setActiveVideoUrl(null)} />}
            {activeImageUrl && <ImageModal url={activeImageUrl} onClose={() => setActiveImageUrl(null)} />}
            {substituteModalProps && <AddExerciseToWorkoutModal {...substituteModalProps} />}
            <ConfirmationModal isOpen={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)} onConfirm={confirmCancelWorkout} title="Cancelar Treino"><p>Tem a certeza que quer cancelar o treino? O progresso não será guardado.</p></ConfirmationModal>

            <div className="animate-fade-in pb-28">
            
            <h1 className="text-3xl font-bold text-white truncate mb-4">{workout?.name}</h1>
            <div className="space-y-4">
                {workout?.exercises.map(ex => {
                    const log = activeSession.logs[ex.workoutExerciseId];
                    if (!log) return null; // Guarda para evitar erros se o log não existir
                    const fullDetails = exercises.find(e => e.id === log.currentExerciseId);

                    return (
                        <TrainingExerciseItem
                            key={ex.workoutExerciseId}
                            workoutExercise={ex}
                            workoutExerciseId={ex.workoutExerciseId}
                            log={log}
                            isExpanded={expandedExercise === ex.workoutExerciseId}
                            onToggleExpand={() => setExpandedExercise(prev => prev === ex.workoutExerciseId ? null : ex.workoutExerciseId)}
                            onSetComplete={() => handleSetComplete(log.rest, ex.workoutExerciseId)}
                            onShowHistory={() => setHistoryModalExercise(fullDetails)}
                            onShowImage={() => fullDetails?.imageUrl && setActiveImageUrl(fullDetails.imageUrl)}
                            onShowVideo={() => fullDetails?.videoUrl && setActiveVideoUrl(fullDetails.videoUrl)}
                            onShowSubstitutes={() => setSubstituteModalInfo({ workoutExerciseId: ex.workoutExerciseId, workoutExercise: ex })}
                    />
                ); 
                })}
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
        </>
    );
}