import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Save, X, Plus, Youtube, TrendingUp, Trash2, ImageIcon, ChevronDown } from 'lucide-react';
import AddExerciseToWorkoutModal from '../../components/modals/AddExerciseToWorkoutModal';
import YouTubePlayerModal from '../../components/modals/YouTubePlayerModal';
import ImageModal from '../../components/modals/ImageModal';
import HistoryModal from '../../components/modals/HistoryModal';
import { InputField } from '../../components/ui/InputField';
import { ConfirmationModal } from '../../components/modals/ConfirmationModal';

function WorkoutExerciseItem({ exercise, onUpdate, onDeleteRequest, onEditSubstitutes }) {
    const { exercises, history } = useAppContext();
    const [isExpanded, setIsExpanded] = useState(false);
    const [translateX, setTranslateX] = useState(0);
    const touchStartX = useRef(0);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [videoModalUrl, setVideoModalUrl] = useState(null);
    const [imageModalUrl, setImageModalUrl] = useState(null);
    const [historyModalExercise, setHistoryModalExercise] = useState(null);

    const fullExercise = exercises.find(e => e.id === exercise.exerciseId) || {};
    
    useEffect(() => {
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }, []);

    const getGroupName = (id) => (exercises.find(e => e.id === id) || {}).name || 'N/A';
    const exerciseHasHistory = (exId) => history.some(h => h.exerciseLogs.some(l => l.exerciseId === exId));
    
    const onTouchStart = (e) => { if (!isTouchDevice) return; touchStartX.current = e.touches[0].clientX; };
    const onTouchMove = (e) => {
        if (!isTouchDevice) return;
        const diff = e.touches[0].clientX - touchStartX.current;
        if (diff < 0 && diff > -150) setTranslateX(diff);
    };
    const onTouchEnd = () => {
        if (!isTouchDevice) return;
        if (translateX < -80) onDeleteRequest();
        setTranslateX(0);
    };

    return (
        <>
            {videoModalUrl && <YouTubePlayerModal url={videoModalUrl} onClose={() => setVideoModalUrl(null)} />}
            {imageModalUrl && <ImageModal url={imageModalUrl} onClose={() => setImageModalUrl(null)} />}
            {historyModalExercise && <HistoryModal exercise={historyModalExercise} history={history} onClose={() => setHistoryModalExercise(null)} />}
            
            <div className="relative bg-gray-700 rounded-lg overflow-hidden">
                 {isTouchDevice && (
                    <div className="absolute inset-y-0 right-0 flex items-center justify-center bg-red-600 text-white px-6" style={{ width: `${Math.abs(translateX)}px` }}>
                        <Trash2 size={24} />
                    </div>
                )}
                <div 
                    className="transition-transform duration-200 ease-out bg-gray-700"
                    onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
                    style={{ transform: `translateX(${translateX}px)` }}
                >
                    <div className="flex justify-between items-center p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                        <p className="font-bold text-lg">{fullExercise.name}</p>
                        <div className="flex items-center gap-2">
                             {!isTouchDevice && (<button type="button" onClick={(e) => { e.stopPropagation(); onDeleteRequest(); }} className="btn-icon text-gray-400 hover:text-red-500"><Trash2 size={20}/></button>)}
                            <ChevronDown size={24} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                    </div>
                    {isExpanded && (
                        <div className="px-4 pb-4 animate-fade-in">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                <InputField label="Séries" type="number" value={exercise.sets} onChange={(e) => onUpdate('sets', e.target.value)} small/>
                                <InputField label="Reps" type="number" value={exercise.reps} onChange={(e) => onUpdate('reps', e.target.value)} small/>
                                <InputField label="Peso (kg)" type="number" value={exercise.weight} onChange={(e) => onUpdate('weight', e.target.value)} small/>
                                <InputField label="Descanso (s)" name="rest" type="number" value={exercise.rest || ''} onChange={(e) => onUpdate('rest', e.target.value)} small/>
                            </div>
                            <div className="border-t border-gray-600 pt-3">
                                <h4 className="text-md font-semibold text-gray-300 mb-2">Substitutos</h4>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {(exercise.substituteIds || []).map(id => (
                                        <span key={id} className="flex items-center gap-1 bg-gray-600 text-xs text-gray-200 px-2 py-1 rounded-full">
                                            {getGroupName(id)}
                                            <button onClick={() => onUpdate('substituteIds', (exercise.substituteIds || []).filter(subId => subId !== id))}><X size={14} /></button>
                                        </span>
                                    ))}
                                </div>
                                <button type="button" onClick={onEditSubstitutes} className="text-sm text-blue-400 hover:underline">Adicionar Substituto</button>
                            </div>
                             <div className="flex items-center justify-end gap-2 border-t border-gray-600 pt-3 mt-4">
                                {exerciseHasHistory(fullExercise.id) && <button type="button" onClick={() => setHistoryModalExercise(fullExercise)} className="btn-icon text-gray-400 hover:text-green-400"><TrendingUp size={28}/></button>}
                                {fullExercise.imageUrl && <button type="button" onClick={() => setImageModalUrl(fullExercise.imageUrl)} className="btn-icon text-gray-400 hover:text-purple-400"><ImageIcon size={28}/></button>}
                                {fullExercise.videoUrl && <button type="button" onClick={() => setVideoModalUrl(fullExercise.videoUrl)} className="btn-icon text-gray-400 hover:text-red-500"><Youtube size={28}/></button>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default function WorkoutEditorPage() {
    const { workouts, setWorkouts, exercises, currentView, navigateTo } = useAppContext();
    const workout = currentView.id ? workouts.find(w => w.id === currentView.id) : { name: 'Novo Treino', exercises: [] };
    
    const [editedWorkout, setEditedWorkout] = useState(workout);
    const [isAddingExercises, setIsAddingExercises] = useState(false);
    const [editingSubstitutesFor, setEditingSubstitutesFor] = useState(null); // ID do exercício do treino
    const [exerciseToRemove, setExerciseToRemove] = useState(null);

    const handleNameChange = (e) => setEditedWorkout({ ...editedWorkout, name: e.target.value });
    
    const handleAddExercises = (selectedIds) => {
        const newExercises = selectedIds.map(id => { 
            const ex = exercises.find(e => e.id === id);
            return { workoutExerciseId: Date.now() + id, exerciseId: ex.id, sets: ex.suggestedSets || '3', reps: ex.suggestedReps || '10', weight: ex.suggestedWeight || '', rest: ex.suggestedRest || '60', notes: '', substituteIds: [] };
        });
        setEditedWorkout(prev => ({ ...prev, exercises: [...prev.exercises, ...newExercises] }));
        setIsAddingExercises(false);
    };

    const handleAddSubstitutes = (selectedIds) => {
        handleUpdateExerciseDetail(editingSubstitutesFor, 'substituteIds', selectedIds);
        setEditingSubstitutesFor(null);
    }

    const handleUpdateExerciseDetail = (workoutExId, field, value) => {
        const updatedExercises = editedWorkout.exercises.map(ex => ex.workoutExerciseId === workoutExId ? { ...ex, [field]: value } : ex);
        setEditedWorkout({ ...editedWorkout, exercises: updatedExercises });
    };

    const handleRemoveExercise = () => {
        if (!exerciseToRemove) return;
        setEditedWorkout({ ...editedWorkout, exercises: editedWorkout.exercises.filter(ex => ex.workoutExerciseId !== exerciseToRemove) });
        setExerciseToRemove(null);
    };

    const onSave = () => {
        console.log('[DEBUG-1] Objeto do treino pronto para salvar:', editedWorkout); 

        if (currentView.id) { 
            setWorkouts(workouts.map(w => w.id === currentView.id ? editedWorkout : w));
        } else { 
            setWorkouts([...workouts, {...editedWorkout, id: Date.now()}]); 
        }
        navigateTo({ page: 'workouts' });
    };

    const onCancel = () => {
        navigateTo({ page: 'workouts' });
    }

    const exerciseForSubstitutes = editedWorkout.exercises.find(ex => ex.workoutExerciseId === editingSubstitutesFor);

    return (
        <div className="animate-fade-in pb-20">
             <ConfirmationModal isOpen={!!exerciseToRemove} onClose={() => setExerciseToRemove(null)} onConfirm={handleRemoveExercise} title="Apagar Exercício do Treino"><p>Tem a certeza que quer remover este exercício do treino?</p></ConfirmationModal>
             {isAddingExercises && <AddExerciseToWorkoutModal existingIds={editedWorkout.exercises.map(e => e.exerciseId)} onAdd={handleAddExercises} onClose={() => setIsAddingExercises(false)} />}
             {editingSubstitutesFor && 
                <AddExerciseToWorkoutModal 
                    existingIds={[exerciseForSubstitutes.exerciseId]} 
                    initialSelectedIds={exerciseForSubstitutes.substituteIds || []} // <<-- LINHA ADICIONADA
                    onAdd={handleAddSubstitutes} 
                    onClose={() => setEditingSubstitutesFor(null)} 
                    title="Selecionar Substitutos"
                />
             }

            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <InputField label="Nome do Treino" value={editedWorkout.name} onChange={handleNameChange} />
                <h3 className="text-xl font-semibold text-white mt-6 mb-4">Exercícios do Treino</h3>
                <div className="space-y-4">
                    {editedWorkout.exercises.map(ex => (
                        <WorkoutExerciseItem 
                            key={ex.workoutExerciseId}
                            exercise={ex}
                            onUpdate={(field, value) => handleUpdateExerciseDetail(ex.workoutExerciseId, field, value)}
                            onDeleteRequest={() => setExerciseToRemove(ex.workoutExerciseId)}
                            onEditSubstitutes={() => setEditingSubstitutesFor(ex.workoutExerciseId)}
                        />
                    ))}
                </div>
                <button type="button" onClick={() => setIsAddingExercises(true)} className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 px-5 rounded-lg border-2 border-gray-600 bg-transparent hover:bg-gray-700 transition-colors mt-6">
                    <Plus size={20}/>
                    <span>Adicionar Exercício ao Treino</span>
                </button>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-6">
                 <button type="button" onClick={onCancel} className="w-full flex items-center justify-center gap-2 text-blue-400 font-semibold py-3 px-5 rounded-lg border-2 border-blue-600 bg-transparent hover:bg-blue-600/20 transition-colors">
                    <X size={20}/>
                    <span>Cancelar</span>
                </button>
                <button type="button" onClick={onSave} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-5 rounded-lg hover:bg-blue-700 transition-colors shadow">
                    <Save size={20}/>
                    <span>Salvar Treino</span>
                </button>
            </div>
        </div>
    );
}
