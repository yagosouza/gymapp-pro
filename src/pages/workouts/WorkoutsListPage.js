import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Clock, PlayCircle, Edit, Trash2, Plus, Repeat } from 'lucide-react';
import { ConfirmationModal } from '../../components/modals/ConfirmationModal';

export function WorkoutsPage() {
    const { workouts, setWorkouts, navigateTo, startWorkoutSession, activeSession } = useAppContext();
    const [itemToDelete, setItemToDelete] = useState(null);
    const activeWorkout = activeSession ? workouts.find(w => w.id === activeSession.workoutId) : null;

    const calculateAverageTime = (workout) => { 
        const totalSets = workout.exercises.reduce((acc, ex) => acc + (parseInt(ex.sets, 10) || 0), 0);
        return totalSets * 2; 
    };
    
    const handleCreate = () => navigateTo({ page: 'workouts', mode: 'edit', id: null });
    const handleEdit = (workout) => navigateTo({ page: 'workouts', mode: 'edit', id: workout.id });
    const handleDelete = (id) => { 
        setWorkouts(workouts.filter(w => w.id !== id));
        setItemToDelete(null); 
    };
    
    return (
        <div className="animate-fade-in pb-24">
            <ConfirmationModal 
                isOpen={!!itemToDelete} 
                onClose={() => setItemToDelete(null)} 
                onConfirm={() => handleDelete(itemToDelete)} 
                title="Apagar Treino"
            >
                <p>Tem a certeza que quer apagar este treino? Esta ação não pode ser desfeita.</p>
            </ConfirmationModal>

            {activeWorkout && (
                 <div className="mb-6">
                    <button onClick={() => navigateTo({ page: 'workouts', mode: 'training'})} className="w-full flex items-center gap-3 p-4 rounded-lg text-lg bg-green-600/20 text-green-300 font-semibold shadow-md border border-green-500/50 hover:bg-green-600/30">
                        <Repeat size={24}/>
                        <span>Voltar ao treino: {activeWorkout.name}</span>
                    </button>
                </div>
            )}

            <h1 className="text-4xl font-bold text-white mb-6">Os Seus Treinos</h1>
            <div className="space-y-6">
                {workouts.map(w => (
                    <div key={w.id} className="bg-gray-800 rounded-xl shadow-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-semibold text-blue-400">{w.name}</h2>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                                        <span>{w.exercises.length} exercícios</span>
                                        <span className="flex items-center gap-1"><Clock size={14}/> ~{calculateAverageTime(w)} min</span>
                                    </div>
                                    {w.lastCompleted && <p className="text-xs text-gray-500 mt-1">Última vez: {new Date(w.lastCompleted).toLocaleString('pt-BR', {dateStyle: 'short', timeStyle: 'short'})}</p>}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => startWorkoutSession(w.id)} className="btn-icon text-green-400 hover:bg-green-800/50" disabled={!!activeSession}><PlayCircle size={24}/></button>
                                    <button onClick={() => handleEdit(w)} className="btn-icon text-gray-400 hover:text-yellow-400"><Edit size={20}/></button>
                                    <button onClick={() => setItemToDelete(w.id)} className="btn-icon text-gray-400 hover:text-red-500"><Trash2 size={20}/></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
             <button onClick={handleCreate} className="fixed bottom-8 right-8 btn-primary !rounded-full !p-4 z-10 shadow-lg animate-fade-in" aria-label="Criar Novo Treino">
                <Plus size={28}/>
            </button>
        </div>
    );
}