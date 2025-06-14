import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { ConfirmationModal } from '../../components/modals/ConfirmationModal';
import { YouTubePlayerModal } from '../../components/modals/YouTubePlayerModal';
import { ImageModal } from '../../components/modals/ImageModal';
import { HistoryModal } from '../../components/modals/HistoryModal';
import { InputField } from '../../components/ui/InputField';
import { StopCircle, CheckCircle, TrendingUp, Youtube, Image as ImageIcon } from 'lucide-react';

export default function TrainingModePage() {
    const { workouts, setWorkouts, exercises, history, setHistory, activeSession, setActiveSession, setCurrentView } = useAppContext();
    const workout = workouts.find(w => w.id === activeSession.workoutId);
    
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [videoModalUrl, setVideoModalUrl] = useState(null);
    const [imageModalUrl, setImageModalUrl] = useState(null);
    const [historyModalExercise, setHistoryModalExercise] = useState(null);

    const getExerciseDetails = (id) => exercises.find(e => e.id === id) || {};
    const exerciseHasHistory = (exId) => history.some(h => h.exerciseLogs.some(l => l.exerciseId === exId));

    useEffect(() => {
        if (!workout) return;
        const currentSessionLogs = activeSession.logs;
        const updatedLogs = { ...currentSessionLogs };
        let hasChanged = false;
        
        workout.exercises.forEach(ex => {
            if (!updatedLogs[ex.workoutExerciseId]) { 
                updatedLogs[ex.workoutExerciseId] = { sets: ex.sets, reps: ex.reps, weight: ex.weight || '', completed: false };
                hasChanged = true;
            }
        });

        Object.keys(updatedLogs).forEach(logId => { 
            if (!workout.exercises.some(ex => ex.workoutExerciseId.toString() === logId)) {
                delete updatedLogs[logId];
                hasChanged = true;
            }
        });

        if(hasChanged) {
            setActiveSession(prev => ({ ...prev, logs: updatedLogs }));
        }
    }, [workout, activeSession.logs, setActiveSession]);

    const handleLogChange = (workoutExId, field, value) => {
        const newLogs = { ...activeSession.logs, [workoutExId]: { ...activeSession.logs[workoutExId], [field]: value } };
        setActiveSession(prev => ({ ...prev, logs: newLogs }));
        setWorkouts(currentWorkouts => currentWorkouts.map(w => 
            w.id === workout.id 
            ? { ...w, exercises: w.exercises.map(ex => ex.workoutExerciseId === workoutExId ? { ...ex, [field]: value } : ex) } 
            : w 
        ));
    };

    const toggleComplete = (workoutExId) => {
        const newLogs = { ...activeSession.logs };
        newLogs[workoutExId].completed = !newLogs[workoutExId].completed;
        setActiveSession(prev => ({ ...prev, logs: newLogs }));
    };
    
    const finishWorkout = () => {
        const allPreviousLogs = history.flatMap(h => h.exerciseLogs.map(log => ({...log, date: h.completionDate})));

        const newExerciseLogs = workout.exercises
            .map(ex => {
                const currentLog = activeSession.logs[ex.workoutExerciseId];
                
                const lastPerformance = allPreviousLogs
                    .filter(log => log.exerciseId === ex.exerciseId)
                    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

                const lastWeight = lastPerformance ? parseFloat(lastPerformance.weight) : null;
                const currentWeight = parseFloat(currentLog.weight);

                if (lastWeight === null || currentWeight !== lastWeight) {
                    return {
                        exerciseId: ex.exerciseId,
                        name: getExerciseDetails(ex.exerciseId).name,
                        sets: currentLog.sets,
                        reps: currentLog.reps,
                        weight: currentLog.weight
                    };
                }
                return null;
            })
            .filter(Boolean); 

        if (newExerciseLogs.length > 0) {
            const newHistoryEntry = { 
                id: Date.now(), 
                workoutId: workout.id, 
                workoutName: workout.name, 
                completionDate: new Date().toISOString(), 
                exerciseLogs: newExerciseLogs
            };
            setHistory(prev => [...prev, newHistoryEntry]);
        }

        setWorkouts(prev => prev.map(w => w.id === workout.id ? { ...w, lastCompleted: new Date().toISOString() } : w));
        setActiveSession(null); 
        setCurrentView({ page: 'workouts' });
    };

    const confirmCancelWorkout = () => { 
        setActiveSession(null); 
        setCurrentView({ page: 'workouts' });
    };
    
    if (!workout) {
        return <div className='text-white'>A carregar treino...</div>;
    }
    
    return (
        <div className="animate-fade-in pb-28">
            <ConfirmationModal isOpen={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)} onConfirm={confirmCancelWorkout} title="Cancelar Treino"><p>Tem a certeza que quer cancelar o treino? O progresso não será guardado.</p></ConfirmationModal>
            {videoModalUrl && <YouTubePlayerModal url={videoModalUrl} onClose={() => setVideoModalUrl(null)} />}
            {imageModalUrl && <ImageModal url={imageModalUrl} onClose={() => setImageModalUrl(null)} />}
            {historyModalExercise && <HistoryModal exercise={historyModalExercise} history={history} onClose={() => setHistoryModalExercise(null)} />}
            
            <h1 className="text-3xl font-bold text-white truncate mb-4">{workout.name}</h1>
            <div className="space-y-4">
                {workout.exercises.map(ex => {
                    const log = activeSession.logs[ex.workoutExerciseId];
                    if (!log) return null; 
                    const isCompleted = log.completed || false;
                    const fullExercise = getExerciseDetails(ex.exerciseId);
                    return (
                        <div key={ex.workoutExerciseId} className={`p-4 rounded-lg transition-all duration-300 ${isCompleted ? 'bg-green-900/50' : 'bg-gray-800'}`}>
                           <div className="flex items-start gap-4">
                                <div onClick={() => toggleComplete(ex.workoutExerciseId)} className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-all mt-1 cursor-pointer ${isCompleted ? 'bg-green-500 border-green-400' : 'border-gray-500'}`}>{isCompleted && <CheckCircle size={24} className="text-white"/>}</div>
                                <div className="flex-grow">
                                    <div className="flex items-center justify-between">
                                        <p className={`font-bold text-xl ${isCompleted ? 'line-through text-gray-500' : 'text-white'}`}>{fullExercise.name}</p>
                                        <div className="flex items-center gap-2">
                                            {exerciseHasHistory(ex.exerciseId) && <button onClick={() => setHistoryModalExercise(fullExercise)} className="btn-icon text-gray-400 hover:text-green-400"><TrendingUp size={18}/></button>}
                                            {fullExercise.imageUrl && <button onClick={() => setImageModalUrl(fullExercise.imageUrl)} className="btn-icon text-gray-400 hover:text-purple-400"><ImageIcon size={18}/></button>}
                                            {fullExercise.videoUrl && <button onClick={() => setVideoModalUrl(fullExercise.videoUrl)} className="btn-icon text-gray-400 hover:text-red-500"><Youtube size={18}/></button>}
                                        </div>
                                    </div>
                                    <div className="mt-3 grid grid-cols-3 gap-3">
                                        <InputField label="Séries" type="number" small value={log.sets} onChange={e => handleLogChange(ex.workoutExerciseId, 'sets', e.target.value)}/>
                                        <InputField label="Reps" type="number" small value={log.reps} onChange={e => handleLogChange(ex.workoutExerciseId, 'reps', e.target.value)}/>
                                        <InputField label="Peso (kg)" type="number" small value={log.weight} onChange={e => handleLogChange(ex.workoutExerciseId, 'weight', e.target.value)}/>
                                    </div>
                                </div>
                           </div>
                        </div>
                    );
                })}
            </div>
             <div className="mt-8 grid grid-cols-1 gap-4">
                <button onClick={finishWorkout} className="w-full btn-primary bg-green-600 hover:bg-green-700 !py-3">
                    <StopCircle size={20}/><span>Finalizar e Salvar Treino</span>
                </button>
                <button onClick={() => setIsCancelModalOpen(true)} className="w-full btn-secondary bg-red-800/60 hover:bg-red-800/80 !py-2">
                    Cancelar Treino
                </button>
            </div>
        </div>
    );
}
