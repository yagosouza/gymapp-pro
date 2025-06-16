import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Search, Trash2, Youtube, TrendingUp, Plus } from 'lucide-react';
import { ConfirmationModal } from '../../components/modals/ConfirmationModal';
import YouTubePlayerModal from '../../components/modals/YouTubePlayerModal';
import ImageModal from '../../components/modals/ImageModal';
import HistoryModal from '../../components/modals/HistoryModal';
import { CustomSelect } from '../../components/ui/CustomSelect';

function ListItem({ item, itemType, onEdit, onDeleteRequest }) {
    const { muscleGroups, history } = useAppContext();
    const [translateX, setTranslateX] = useState(0);
    const touchStartX = useRef(0);
    const itemRef = useRef(null);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [videoModalUrl, setVideoModalUrl] = useState(null);
    const [imageModalUrl, setImageModalUrl] = useState(null);
    const [historyModalExercise, setHistoryModalExercise] = useState(null);

    useEffect(() => {
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }, []);

    const getGroupName = (id) => muscleGroups.find(g => g.id === id)?.name || 'N/A';
    const exerciseHasHistory = (exId) => history.some(h => h.exerciseLogs.some(l => l.exerciseId === exId));

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
        <>
            {videoModalUrl && <YouTubePlayerModal url={videoModalUrl} onClose={() => setVideoModalUrl(null)} />}
            {imageModalUrl && <ImageModal url={imageModalUrl} onClose={() => setImageModalUrl(null)} />}
            {historyModalExercise && <HistoryModal exercise={historyModalExercise} history={history} onClose={() => setHistoryModalExercise(null)} />}
        
            <div className="relative overflow-hidden rounded-lg">
                {isTouchDevice && (
                    <div className="absolute inset-y-0 right-0 flex items-center justify-center bg-red-600 text-white px-6" style={{ width: `${Math.abs(translateX)}px` }}>
                        <Trash2 size={24} />
                    </div>
                )}
                <div
                    ref={itemRef}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    onClick={onEdit}
                    className="flex items-center gap-4 bg-gray-800 p-4 cursor-pointer transition-transform duration-200 ease-out"
                    style={{ transform: `translateX(${translateX}px)` }}
                >
                    {itemType === 'exercises' && (
                        <img
                            src={item.imageUrl || 'https://placehold.co/128x128/1f2937/FFFFFF?text=GYM'}
                            alt={item.name}
                            className="w-20 h-20 rounded-md object-cover flex-shrink-0 cursor-pointer"
                            onClick={(e) => { e.stopPropagation(); if (item.imageUrl) setImageModalUrl(item.imageUrl); }}
                            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/128x128/1f2937/FFFFFF?text=GYM'; }}
                        />
                    )}
                    <div className="flex-grow">
                        <p className="font-bold text-lg">{item.name}</p>
                        {itemType === 'exercises' && (
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className="text-sm font-semibold text-white bg-blue-600 px-2 py-1 rounded-full">{getGroupName(item.muscleGroupId)}</span>
                                {item.secondaryMuscleGroupIds?.map(id => (<span key={id} className="text-xs font-semibold text-gray-300 bg-gray-600 px-2 py-1 rounded-full">{getGroupName(id)}</span>))}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {!isTouchDevice && (<button onClick={onDeleteRequest} className="btn-icon text-gray-400 hover:text-red-500"><Trash2 size={24}/></button>)}
                        {itemType === 'exercises' && exerciseHasHistory(item.id) && <button onClick={() => setHistoryModalExercise(item)} className="btn-icon text-gray-400 hover:text-green-400"><TrendingUp size={28} /></button>}
                        {itemType === 'exercises' && item.videoUrl && <button onClick={() => setVideoModalUrl(item.videoUrl)} className="btn-icon text-gray-400 hover:text-red-500"><Youtube size={28} /></button>}
                    </div>
                </div>
            </div>
        </>
    );
}

export default function ListPageContainer({ pageTitle, itemType }) {
    const { exercises, setExercises, muscleGroups, setMuscleGroups, navigateTo } = useAppContext();
    const [itemToDelete, setItemToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [primaryFilterGroup, setPrimaryFilterGroup] = useState('');
    const [secondaryFilterGroup, setSecondaryFilterGroup] = useState('');
    
    const items = itemType === 'exercises' ? exercises : muscleGroups;
    const setItems = itemType === 'exercises' ? setExercises : setMuscleGroups;

    const handleDelete = (id) => {
        if (itemType === 'groups') {
            const isGroupInUse = exercises.some(ex => ex.muscleGroupId === id || (ex.secondaryMuscleGroupIds && ex.secondaryMuscleGroupIds.includes(id)));
            if (isGroupInUse) { alert('Este grupo muscular está a ser usado em exercícios e não pode ser excluído.'); return; }
        }
        setItems(prevItems => prevItems.filter(item => item.id !== id));
        setItemToDelete(null);
    };

    const getGroupName = (id) => muscleGroups.find(g => g.id === id)?.name || 'N/A';
    
    const filteredItems = items.filter(item => {
        if (itemType !== 'exercises') {
            return item.name.toLowerCase().includes(searchTerm.toLowerCase());
        }
        const searchTermLower = searchTerm.toLowerCase();
        const nameMatch = item.name.toLowerCase().includes(searchTermLower);
        const primaryGroupName = getGroupName(item.muscleGroupId).toLowerCase();
        const searchInPrimary = primaryGroupName.includes(searchTermLower);
        const secondaryGroupNames = (item.secondaryMuscleGroupIds || []).map(id => getGroupName(id).toLowerCase());
        const searchInSecondary = secondaryGroupNames.some(name => name.includes(searchTermLower));
        const primaryGroupMatch = !primaryFilterGroup || item.muscleGroupId === parseInt(primaryFilterGroup);
        const secondaryGroupMatch = !secondaryFilterGroup || (item.secondaryMuscleGroupIds && item.secondaryMuscleGroupIds.includes(parseInt(secondaryFilterGroup)));

        return (nameMatch || searchInPrimary || searchInSecondary) && primaryGroupMatch && secondaryGroupMatch;
    });

    return (
        <div className="animate-fade-in h-full flex flex-col">
            <ConfirmationModal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)} onConfirm={() => handleDelete(itemToDelete)} title={`Apagar ${itemType === 'exercises' ? 'Exercício' : 'Grupo'}`}><p>Tem a certeza? Esta ação não pode ser desfeita.</p></ConfirmationModal>
            
            <div className="flex-shrink-0">
                <div className="relative mb-4"><Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input type="text" placeholder="Buscar por nome ou grupo muscular..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full p-3 pl-10 input-base"/></div>
                
                {itemType === 'exercises' && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div><label className="block text-xs font-medium text-gray-400 mb-1">Grupo Principal</label><CustomSelect placeholder="Todos" options={[{id: '', name: 'Todos'}, ...muscleGroups]} value={primaryFilterGroup} onChange={setPrimaryFilterGroup} /></div>
                        <div><label className="block text-xs font-medium text-gray-400 mb-1">Grupo Secundário</label><CustomSelect placeholder="Todos" options={[{id: '', name: 'Todos'}, ...muscleGroups]} value={secondaryFilterGroup} onChange={setSecondaryFilterGroup} /></div>
                    </div>
                )}
                 <button onClick={() => navigateTo({ page: itemType, mode: 'create' })} className="w-full btn-primary bg-blue-600/80 hover:bg-blue-600 mb-6 py-3 rounded-lg flex items-center justify-center">
                    <Plus size={20} className="mr-2"/>
                    <span>Adicionar Novo {itemType === 'exercises' ? 'Exercício' : 'Grupo'}</span>
                </button>
            </div>

            <div className="space-y-3 overflow-y-auto flex-grow pb-16">
                {filteredItems.map(item => (
                    <ListItem 
                        key={item.id}
                        item={item}
                        itemType={itemType}
                        onEdit={() => navigateTo({ page: itemType, mode: 'edit', id: item.id })}
                        onDeleteRequest={() => setItemToDelete(item.id)}
                    />
                ))}
            </div>
        </div>
    );
}

