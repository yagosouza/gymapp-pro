import React, { useState } from 'react';
import { Plus, Trash2, Edit, Youtube, Search, TrendingUp, Image as ImageIcon } from 'lucide-react';
import { ConfirmationModal } from '../../components/modals/ConfirmationModal';
import { YouTubePlayerModal } from '../../components/modals/YouTubePlayerModal';
import { ImageModal } from '../../components/modals/ImageModal';
import { HistoryModal } from '../../components/modals/HistoryModal';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { useAppContext } from '../../context/AppContext';

export function ListPageContainer(pageTitle, itemType) {
    const {setCurrentView, muscleGroups, exercises, setExercises, setMuscleGroups, history } = useAppContext();
    const [itemToDelete, setItemToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGroup, setFilterGroup] = useState('');
    const [videoModalUrl, setVideoModalUrl] = useState(null);
    const [imageModalUrl, setImageModalUrl] = useState(null);
    const [historyModalExercise, setHistoryModalExercise] = useState(null);
    const items = itemType === 'exercises' ? exercises : muscleGroups;
    const setItems = itemType === 'exercises' ? setExercises : setMuscleGroups;
    const handleDelete = (id) => {
        if (itemType === 'groups') {
            const isGroupInUse = exercises.some(ex => ex.muscleGroupId === id || ex.secondaryMuscleGroupIds.includes(id));
            if (isGroupInUse) { alert('Este grupo muscular está a ser usado em exercícios e não pode ser excluído.'); return; }
        }
        setItems(prevItems => prevItems.filter(item => item.id !== id));
        setItemToDelete(null);
    };
    const getGroupName = (id) => muscleGroups.find(g => g.id === id)?.name || 'N/A';
    const exerciseHasHistory = (exId) => history.some(h => h.exerciseLogs.some(l => l.exerciseId === exId));
    const filteredItems = items.filter(item => {
        const nameMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        if (itemType === 'exercises') { const groupMatch = filterGroup ? item.muscleGroupId === parseInt(filterGroup) : true; return nameMatch && groupMatch; }
        return nameMatch;
    });
    return (
        <div className="animate-fade-in pb-24">
            <ConfirmationModal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)} onConfirm={() => handleDelete(itemToDelete)} title={`Apagar ${itemType === 'exercises' ? 'Exercício' : 'Grupo'}`}><p>Tem a certeza? Esta ação não pode ser desfeita.</p></ConfirmationModal>
            {videoModalUrl && <YouTubePlayerModal url={videoModalUrl} onClose={() => setVideoModalUrl(null)} />}
            {imageModalUrl && <ImageModal url={imageModalUrl} onClose={() => setImageModalUrl(null)} />}
            {historyModalExercise && <HistoryModal exercise={historyModalExercise} history={history} onClose={() => setHistoryModalExercise(null)} />}
            <h1 className="text-4xl font-bold text-white mb-6">{pageTitle}</h1>
            {itemType === 'exercises' && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"><div className="relative"><Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input type="text" placeholder="Buscar por nome..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full p-3 pl-10 input-base"/></div><CustomSelect options={[{id: '', name: 'Todos os Grupos'}, ...muscleGroups]} value={filterGroup} onChange={setFilterGroup} /></div>)}
            <div className="space-y-3">
                {filteredItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
                         <div><p className="font-bold text-lg">{item.name}</p>
                            {itemType === 'exercises' && (<div className="flex flex-wrap items-center gap-2 mt-1"><span className="text-sm font-semibold text-white bg-blue-600 px-2 py-0.5 rounded-full">{getGroupName(item.muscleGroupId)}</span>{item.secondaryMuscleGroupIds?.map(id => (<span key={id} className="text-xs font-semibold text-gray-300 bg-gray-600 px-2 py-0.5 rounded-full">{getGroupName(id)}</span>))}</div>)}
                        </div>
                        <div className="flex items-center gap-1 md:gap-2">
                            {itemType === 'exercises' && item.imageUrl && <button onClick={() => setImageModalUrl(item.imageUrl)} className="btn-icon text-gray-400 hover:text-purple-400"><ImageIcon size={20}/></button>}
                            {itemType === 'exercises' && exerciseHasHistory(item.id) && <button onClick={() => setHistoryModalExercise(item)} className="btn-icon text-gray-400 hover:text-green-400"><TrendingUp size={20}/></button>}
                            {itemType === 'exercises' && item.videoUrl && <button onClick={() => setVideoModalUrl(item.videoUrl)} className="btn-icon text-gray-400 hover:text-red-500"><Youtube size={20}/></button>}
                            <button onClick={() => setCurrentView({ page: itemType, mode: 'edit', id: item.id })} className="btn-icon text-gray-400 hover:text-yellow-400"><Edit size={20}/></button>
                            <button onClick={() => setItemToDelete(item.id)} className="btn-icon text-gray-400 hover:text-red-500"><Trash2 size={20}/></button>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={() => setCurrentView({ page: itemType, mode: 'create' })} className="fixed bottom-8 right-8 btn-primary !rounded-full !p-4 z-10 shadow-lg animate-fade-in" aria-label={`Adicionar ${itemType}`}><Plus size={28}/></button>
        </div>
    );
}
