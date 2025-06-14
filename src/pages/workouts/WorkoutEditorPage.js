import React, { useState } from 'react';
import { Plus, Trash2,  Save, X,  Youtube,  TrendingUp } from 'lucide-react';

import { AddExerciseToWorkoutModal } from '../../components/modals/AddExerciseToWorkoutModal';
import { YouTubePlayerModal } from '../../components/modals/YouTubePlayerModal';
import { HistoryModal } from '../../components/modals/HistoryModal';
import { InputField } from '../../components/ui/InputField';
import { useAppContext } from '../../context/AppContext';

//export function WorkoutEditor({ workout, onSave, onCancel, allExercises, history }) {
export function WorkoutEditor() {
    const { workouts, setWorkouts, currentView, setCurrentView, exercises, history } = useAppContext();

    const workout = workouts.find(w => w.id === currentView.id);

    const [editedWorkout, setEditedWorkout] = useState(workout);

    // Salvar: atualiza o treino na lista e volta para a tela de listagem
    const onSave = (updatedWorkout) => {
        setWorkouts(workouts.map(w => w.id === updatedWorkout.id ? updatedWorkout : w));
        setCurrentView({ page: 'workouts' }); // volta para a lista de treinos
    };

    // Cancelar: apenas volta para a tela de listagem sem salvar
    const onCancel = () => {
        setCurrentView({ page: 'workouts' });
    };

    const [isSelecting, setIsSelecting] = useState(false);
    const [videoModalUrl, setVideoModalUrl] = useState(null);
    const [historyModalExercise, setHistoryModalExercise] = useState(null);
    const handleNameChange = (e) => setEditedWorkout({ ...editedWorkout, name: e.target.value });
    const handleAddExercises = (selectedIds) => {
        const newExercises = selectedIds.map(id => { const ex = exercises.find(e => e.id === id); return { workoutExerciseId: Date.now() + id, exerciseId: ex.id, sets: ex.suggestedSets || '3', reps: ex.suggestedReps || '10', weight: ex.suggestedWeight || '', notes: '' }; });
        setEditedWorkout({ ...editedWorkout, exercises: [...editedWorkout.exercises, ...newExercises] });
        setIsSelecting(false);
    };
    const handleUpdateExerciseDetail = (workoutExId, field, value) => { const updated = editedWorkout.exercises.map(ex => ex.workoutExerciseId === workoutExId ? { ...ex, [field]: value } : ex); setEditedWorkout({ ...editedWorkout, exercises: updated }); };
    const handleRemoveExercise = (workoutExId) => { setEditedWorkout({ ...editedWorkout, exercises: editedWorkout.exercises.filter(ex => ex.workoutExerciseId !== workoutExId) }); };
    const getExerciseDetails = (id) => exercises.find(e => e.id === id) || {};
    const exerciseHasHistory = (exId) => history.some(h => h.exerciseLogs.some(l => l.exerciseId === exId));

    return (
        <div className="animate-fade-in pb-20">
             {isSelecting && <AddExerciseToWorkoutModal existingIds={editedWorkout.exercises.map(e => e.exerciseId)} onAdd={handleAddExercises} onClose={() => setIsSelecting(false)} />}
             {videoModalUrl && <YouTubePlayerModal url={videoModalUrl} onClose={() => setVideoModalUrl(null)} />}
             {historyModalExercise && <HistoryModal exercise={historyModalExercise} history={history} onClose={() => setHistoryModalExercise(null)} />}
            <div className="flex justify-between items-center mb-6"><h1 className="text-3xl font-bold text-white">Editando Treino</h1><div className="flex gap-4"><button onClick={() => onSave(editedWorkout)} className="btn-primary"><Save size={20}/><span>Salvar</span></button><button onClick={onCancel} className="btn-secondary"><X size={20}/><span>Cancelar</span></button></div></div>
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg"><InputField label="Nome do Treino" value={editedWorkout.name} onChange={handleNameChange} /><h3 className="text-xl font-semibold text-white mt-6 mb-4">Exercícios do Treino</h3>
                <div className="space-y-4">
                    {editedWorkout.exercises.map(ex => {
                        const fullExercise = getExerciseDetails(ex.exerciseId);
                        return (
                            <div key={ex.workoutExerciseId} className="bg-gray-700 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-2"><p className="font-bold text-lg">{fullExercise.name}</p>
                                    <div className="flex items-center gap-2">
                                        {exerciseHasHistory(ex.exerciseId) && <button onClick={() => setHistoryModalExercise(fullExercise)} className="btn-icon text-gray-400 hover:text-green-400"><TrendingUp size={18}/></button>}
                                        {fullExercise.videoUrl && <button onClick={() => setVideoModalUrl(fullExercise.videoUrl)} className="btn-icon text-gray-400 hover:text-red-500"><Youtube size={18}/></button>}
                                        <button onClick={() => handleRemoveExercise(ex.workoutExerciseId)} className="btn-icon text-gray-400 hover:text-red-500"><Trash2 size={18}/></button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3"><InputField label="Séries" type="text" value={ex.sets} onChange={(e) => handleUpdateExerciseDetail(ex.workoutExerciseId, 'sets', e.target.value)} small/><InputField label="Reps" type="text" value={ex.reps} onChange={(e) => handleUpdateExerciseDetail(ex.workoutExerciseId, 'reps', e.target.value)} small/><InputField label="Peso (kg)" type="text" value={ex.weight} onChange={(e) => handleUpdateExerciseDetail(ex.workoutExerciseId, 'weight', e.target.value)} small/><InputField label="Notas" value={ex.notes} onChange={(e) => handleUpdateExerciseDetail(ex.workoutExerciseId, 'notes', e.target.value)} placeholder="Ex: Aumentar peso" small/></div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <button onClick={() => setIsSelecting(true)} className="fixed bottom-8 right-8 btn-primary !rounded-full !p-4 z-10 shadow-lg animate-fade-in"><Plus size={28}/></button>
        </div>
    );
}