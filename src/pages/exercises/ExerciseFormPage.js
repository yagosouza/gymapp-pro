import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Save, X, Youtube, ImageIcon, ChevronDown } from 'lucide-react';
import { InputField } from '../../components/ui/InputField';
import { CustomSelect } from '../../components/ui/CustomSelect';
import YouTubePlayerModal from '../../components/modals/YouTubePlayerModal';
import ImageModal from '../../components/modals/ImageModal';

export function ExerciseFormPage() {
    const { exercises, setExercises, muscleGroups, currentView, navigateTo } = useAppContext();
    const exercise = currentView.mode === 'edit' ? exercises.find(ex => ex.id === currentView.id) : null;
    
    const [formState, setFormState] = useState(
        exercise 
            ? { ...exercise, secondaryMuscleGroupIds: exercise.secondaryMuscleGroupIds || [] } 
            : { name: '', muscleGroupId: '', secondaryMuscleGroupIds: [], suggestedSets: '', suggestedReps: '', suggestedWeight: '', suggestedRest: '60', videoUrl: '', imageUrl: '' }
    );
    
    const [showSecondaryGroups, setShowSecondaryGroups] = useState(false);
    const [showSuggestedValues, setShowSuggestedValues] = useState(false);
    const [showMedia, setShowMedia] = useState(false);
    const [videoModalUrl, setVideoModalUrl] = useState(null);
    const [imageModalUrl, setImageModalUrl] = useState(null);

    const handleInputChange = (e) => setFormState({ ...formState, [e.target.name]: e.target.value });
    
    const handleSecondaryGroupChange = (groupId) => {
        const currentIds = formState.secondaryMuscleGroupIds;
        const newIds = currentIds.includes(groupId) ? currentIds.filter(id => id !== groupId) : [...currentIds, groupId];
        setFormState({ ...formState, secondaryMuscleGroupIds: newIds });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formState.name.trim() || !formState.muscleGroupId) { 
            alert('Nome e Grupo Muscular Principal são obrigatórios.'); 
            return; 
        }
        const finalFormState = { ...formState, muscleGroupId: parseInt(formState.muscleGroupId, 10) || null };
        if (exercise) { 
            setExercises(exercises.map(ex => ex.id === exercise.id ? finalFormState : ex));
        } else { 
            setExercises([...exercises, { ...finalFormState, id: Date.now() }]); 
        }
        navigateTo({ page: 'exercises' });
    };

    const onCancel = () => {
        navigateTo({ page: 'exercises' });
    }

    return (
        <div className="animate-fade-in pb-20">
            {videoModalUrl && <YouTubePlayerModal url={videoModalUrl} onClose={() => setVideoModalUrl(null)} />}
            {imageModalUrl && <ImageModal url={imageModalUrl} onClose={() => setImageModalUrl(null)} />}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-gray-800 p-6 rounded-xl space-y-4">
                    <InputField label="Nome do Exercício" name="name" value={formState.name} onChange={handleInputChange} required />
                    <div>
                        <label className="block mb-1 font-medium text-gray-300">Grupo Muscular Principal</label>
                        <CustomSelect options={muscleGroups} value={formState.muscleGroupId} onChange={(value) => setFormState(p => ({...p, muscleGroupId: value}))} />
                    </div>
                    
                    <div className="border border-gray-700 rounded-lg">
                        <button type="button" onClick={() => setShowSecondaryGroups(!showSecondaryGroups)} className="w-full flex justify-between items-center text-left text-gray-200 p-4 bg-gray-700/50 rounded-t-lg hover:bg-gray-700">
                            <span className="font-semibold">Grupos Musculares Secundários</span>
                            <ChevronDown size={20} className={`transition-transform ${showSecondaryGroups ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {showSecondaryGroups && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-4 animate-fade-in">
                                {muscleGroups.filter(g => g.id !== formState.muscleGroupId).map(group => (
                                    <label key={group.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700 cursor-pointer">
                                        <input type="checkbox" checked={formState.secondaryMuscleGroupIds.includes(group.id)} onChange={() => handleSecondaryGroupChange(group.id)} className="form-checkbox h-5 w-5 bg-gray-700 border-gray-600 rounded text-blue-500 focus:ring-blue-500"/>
                                        <span className="text-sm">{group.name}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-xl space-y-4">
                     <button type="button" onClick={() => setShowSuggestedValues(!showSuggestedValues)} className="w-full flex justify-between items-center text-left">
                        <h3 className="text-xl font-semibold text-white">Valores Sugeridos</h3>
                        <ChevronDown size={24} className={`transition-transform text-blue-400 ${showSuggestedValues ? 'rotate-180' : ''}`} />
                    </button>
                     {showSuggestedValues && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in pt-4">
                            <InputField label="Séries" name="suggestedSets" type="number" value={formState.suggestedSets} onChange={handleInputChange}/>
                            <InputField label="Reps" name="suggestedReps" type="number" value={formState.suggestedReps} onChange={handleInputChange}/>
                            <InputField label="Peso (kg)" name="suggestedWeight" type="number" value={formState.suggestedWeight} onChange={handleInputChange}/>
                            <InputField label="Descanso (s)" name="suggestedRest" type="number" value={formState.suggestedRest} onChange={handleInputChange}/>
                        </div>
                     )}
                </div>

                 <div className="bg-gray-800 p-6 rounded-xl space-y-4">
                    <button type="button" onClick={() => setShowMedia(!showMedia)} className="w-full flex justify-between items-center text-left">
                        <h3 className="text-xl font-semibold text-white">Mídia</h3>
                        <ChevronDown size={24} className={`transition-transform text-blue-400 ${showMedia ? 'rotate-180' : ''}`} />
                    </button>
                    {showMedia && (
                        <div className="space-y-4 animate-fade-in pt-4">
                            <div className="flex items-center gap-2">
                                <div className="flex-grow"><InputField label="URL da Imagem" name="imageUrl" value={formState.imageUrl} onChange={handleInputChange}/></div>
                                <button type="button" onClick={() => formState.imageUrl && setImageModalUrl(formState.imageUrl)} className="btn-icon self-end" disabled={!formState.imageUrl}><ImageIcon /></button>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex-grow"><InputField label="URL do Vídeo (YouTube)" name="videoUrl" value={formState.videoUrl} onChange={handleInputChange}/></div>
                                <button type="button" onClick={() => formState.videoUrl && setVideoModalUrl(formState.videoUrl)} className="btn-icon self-end" disabled={!formState.videoUrl}><Youtube /></button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                     <button type="button" onClick={onCancel} className="w-full flex items-center justify-center gap-2 text-blue-400 font-semibold py-3 px-5 rounded-lg border-2 border-blue-600 hover:bg-blue-600/20 transition-colors">
                        <X size={20}/>
                        <span>Cancelar</span>
                    </button>
                    <button type="submit" className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-5 rounded-lg hover:bg-blue-700 transition-colors shadow">
                        <Save size={20}/>
                        <span>Salvar</span>
                    </button>
                </div>
            </form>
        </div>
    );
}


