import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { InputField } from '../../components/ui/InputField';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { useAppContext } from '../../context/AppContext';

export function ExerciseFormPage(){
    const { exercises, setExercises, muscleGroups, currentView, setCurrentView } = useAppContext();

    const exercise = exercises.find(ex => ex.id === currentView.id);

    const onSave = () => setCurrentView({ page: 'exercises' });
    const onCancel = () => setCurrentView({ page: 'exercises' });

    const [formState, setFormState] = useState(exercise ? { ...exercise, secondaryMuscleGroupIds: exercise.secondaryMuscleGroupIds || [] } : { name: '', muscleGroupId: '', secondaryMuscleGroupIds: [], suggestedSets: '', suggestedReps: '', suggestedWeight: '', videoUrl: '', imageUrl: '' });
    const handleInputChange = (e) => setFormState({ ...formState, [e.target.name]: e.target.value });
    const handleSecondaryGroupChange = (groupId) => {
        const currentIds = formState.secondaryMuscleGroupIds;
        const newIds = currentIds.includes(groupId) ? currentIds.filter(id => id !== groupId) : [...currentIds, groupId];
        setFormState({ ...formState, secondaryMuscleGroupIds: newIds });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formState.name.trim() || !formState.muscleGroupId) { alert('Nome e Grupo Muscular são obrigatórios.'); return; }
        const finalFormState = { ...formState, muscleGroupId: parseInt(formState.muscleGroupId, 10) || null };
        if (exercise) { setExercises(exercises.map(ex => ex.id === exercise.id ? finalFormState : ex));
        } else { setExercises([...exercises, { ...finalFormState, id: Date.now() }]); }
        onSave();
    };
    return(<div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6"><h1 className="text-3xl font-bold text-white">{exercise ? 'Editar' : 'Novo'} Exercício</h1><div className="flex gap-4"><button onClick={onCancel} className="btn-secondary"><X size={20}/> Cancelar</button><button onClick={handleSubmit} className="btn-primary"><Save size={20}/> Salvar</button></div></div>
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded-xl">
            <InputField label="Nome" name="name" value={formState.name} onChange={handleInputChange} required autoFocus/>
            <div><label className="block mb-1 font-medium text-gray-300">Grupo Muscular Principal</label><CustomSelect options={muscleGroups} value={formState.muscleGroupId} onChange={(value) => setFormState(p => ({...p, muscleGroupId: value}))} /></div>
            <div><label className="block mb-2 font-medium text-gray-300">Grupos Musculares Secundários</label><div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2 bg-gray-900/50 rounded-lg">{muscleGroups.filter(g => g.id !== formState.muscleGroupId).map(group => (<label key={group.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700 cursor-pointer"><input type="checkbox" checked={formState.secondaryMuscleGroupIds.includes(group.id)} onChange={() => handleSecondaryGroupChange(group.id)} className="form-checkbox h-5 w-5 bg-gray-700 border-gray-600 rounded text-blue-500 focus:ring-blue-500"/><span className="text-sm">{group.name}</span></label>))}</div></div>
            <div className="grid grid-cols-3 gap-4"><InputField label="Séries Sug." name="suggestedSets" type="number" value={formState.suggestedSets} onChange={handleInputChange}/><InputField label="Reps Sug." name="suggestedReps" type="number" value={formState.suggestedReps} onChange={handleInputChange}/><InputField label="Peso Sug. (kg)" name="suggestedWeight" type="number" value={formState.suggestedWeight} onChange={handleInputChange}/></div>
            <InputField label="URL da Imagem" name="imageUrl" value={formState.imageUrl} onChange={handleInputChange}/>
            <InputField label="URL do Vídeo (YouTube)" name="videoUrl" value={formState.videoUrl} onChange={handleInputChange}/>
        </form>
    </div>);
}