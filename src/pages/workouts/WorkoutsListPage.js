import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Clock, PlayCircle, Trash2, Plus, ChevronDown } from 'lucide-react';
import { ConfirmationModal } from '../../components/modals/ConfirmationModal';

function WorkoutListItem({ workout, onEdit, onDeleteRequest, onStart }) {
    const { exercises } = useAppContext();
    const [isExpanded, setIsExpanded] = useState(false);
    const [translateX, setTranslateX] = useState(0);
    const touchStartX = useRef(0);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }, []);

    const getExerciseName = (id) => (exercises.find(e => e.id === id) || {}).name || 'Exercício não encontrado';
    const calculateAverageTime = (w) => {
        const totalSets = w.exercises.reduce((acc, ex) => acc + (parseInt(ex.sets, 10) || 0), 0);
        return totalSets * 2;
    };

    const onTouchStart = (e) => {
        if (!isTouchDevice) return;
        touchStartX.current = e.touches[0].clientX;
    };

    const onTouchMove = (e) => {
        if (!isTouchDevice) return;
        const currentX = e.touches[0].clientX;
        const diff = currentX - touchStartX.current;
        if (diff < 0 && diff > -150) {
            setTranslateX(diff);
        }
    };

    const onTouchEnd = () => {
        if (!isTouchDevice) return;
        if (translateX < -80) {
            onDeleteRequest();
        }
        setTranslateX(0);
    };

    return (
        <div className="relative bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {isTouchDevice && (
                <div className="absolute inset-y-0 right-0 flex items-center justify-center bg-red-600 text-white px-6" style={{ width: `${Math.abs(translateX)}px`, opacity: Math.min(Math.abs(translateX) / 100, 1) }}>
                    <Trash2 size={24} />
                </div>
            )}
            <div
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                className="transition-transform duration-200 ease-out"
                style={{ transform: `translateX(${translateX}px)` }}
            >
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <div className="flex-grow cursor-pointer" onClick={onEdit}>
                            <h2 className="text-2xl font-semibold text-blue-400">{workout.name}</h2>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                                <span>{workout.exercises.length} exercícios</span>
                                <span className="flex items-center gap-1"><Clock size={14}/> ~{calculateAverageTime(workout)} min</span>
                            </div>
                            {workout.lastCompleted && <p className="text-xs text-gray-500 mt-1">Última vez: {new Date(workout.lastCompleted).toLocaleString('pt-BR', {dateStyle: 'short', timeStyle: 'short'})}</p>}
                        </div>
                        <div className="flex flex-col items-center gap-2">
                             {!isTouchDevice && <button onClick={onDeleteRequest} className="btn-icon text-gray-400 hover:text-red-500"><Trash2 size={24}/></button>}
                            <button onClick={onStart} className="btn-icon text-green-400 hover:bg-green-800/50"><PlayCircle size={28}/></button>
                            <button onClick={() => setIsExpanded(!isExpanded)} className="btn-icon text-gray-400"><ChevronDown size={28} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}/></button>
                        </div>
                    </div>
                </div>
                {isExpanded && (
                    <div className="px-6 pb-6 animate-fade-in">
                        <div className="border-t border-gray-700 pt-4 space-y-2">
                            {workout.exercises.map(ex => (
                                <p key={ex.workoutExerciseId} className="text-gray-300 text-sm">- {getExerciseName(ex.exerciseId)}</p>
                            ))}
                            {workout.exercises.length === 0 && <p className="text-gray-500 text-sm">Nenhum exercício neste treino.</p>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function WorkoutsListPage() {
    const { workouts, setWorkouts, navigateTo, startWorkoutSession } = useAppContext();
    const [itemToDelete, setItemToDelete] = useState(null);

    const handleCreate = () => navigateTo({ page: 'workouts', mode: 'edit' });
    const handleEdit = (workout) => navigateTo({ page: 'workouts', mode: 'edit', id: workout.id });
    const handleDelete = (id) => { 
        setWorkouts(workouts.filter(w => w.id !== id));
        setItemToDelete(null); 
    };
    
    return (
        <div className="animate-fade-in h-full flex flex-col">
            <ConfirmationModal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)} onConfirm={() => handleDelete(itemToDelete)} title="Apagar Treino"><p>Tem a certeza que quer apagar este treino? Esta ação não pode ser desfeita.</p></ConfirmationModal>
            
            <div className="flex-shrink-0">
                <button onClick={handleCreate} className="w-full btn-primary bg-blue-600/80 hover:bg-blue-600 mb-6 py-3 rounded-lg flex items-center justify-center">
                    <Plus size={20}/>
                    <span>Adicionar Novo Treino</span>
                </button>
            </div>
            
            <div className="space-y-6 overflow-y-auto flex-grow pb-16">
                {workouts.map(w => (
                    <WorkoutListItem
                        key={w.id}
                        workout={w}
                        onStart={() => startWorkoutSession(w.id)}
                        onEdit={() => handleEdit(w)}
                        onDeleteRequest={() => setItemToDelete(w.id)}
                    />
                ))}
            </div>
        </div>
    );
}
