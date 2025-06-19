import React, { useState, useMemo } from 'react'; // Adicionado useMemo
import { useAppContext } from '../../context/AppContext';
import { calculateBMI, calculateBodyFat } from '../../utils/calculations';
// --- (NOVO) Ícones adicionados para a nova funcionalidade ---
import { Edit, Save, Trash2, Info, PlusCircle, ArrowUpCircle, ArrowDownCircle, ChevronDown, SlidersHorizontal, ArrowUp, ArrowDown } from 'lucide-react';
import { InputField } from '../../components/ui/InputField';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { ConfirmationModal } from '../../components/modals/ConfirmationModal';
import { InfoModal } from '../../components/modals/InfoModal';
// --- (NOVO) Importar a base do Modal para a nova funcionalidade ---
import { ModalBase } from '../../components/modals/ModalBase';


// --- (NOVO) Lista Mestra de todos os atalhos possíveis ---
const ALL_SHORTCUT_ITEMS = [
    { id: 'workouts', title: 'Treinos' },
    { id: 'exercises', title: 'Exercícios' },
    { id: 'bmi', title: 'IMC' },
    { id: 'bodyFat', title: '% Gordura' }
];

export function ProfilePage() {
    const { profile, updateProfileAPI } = useAppContext();
    const [isEditing, setIsEditing] = useState(false);
    const [isAddingRecord, setIsAddingRecord] = useState(false);
    const [isHistoryVisible, setIsHistoryVisible] = useState(false);
    const [editableProfile, setEditableProfile] = useState({ name: profile.name, height: profile.height, age: profile.age, gender: profile.gender });
    const [activeTab, setActiveTab] = useState('circumferences');
    const [historyTab, setHistoryTab] = useState('circumferences');
    const [infoModalContent, setInfoModalContent] = useState(null);
    const [recordToDelete, setRecordToDelete] = useState(null);

    // --- (NOVO) Estados para o modal de edição de atalhos ---
    const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
    // Inicializa com os atalhos salvos ou com um padrão
    const [editedShortcuts, setEditedShortcuts] = useState(profile.homeShortcuts || ['workouts', 'exercises', 'bmi', 'bodyFat']);


    const circumferenceLabels = { shoulder: 'Ombro (cm)', chest: 'Peitoral (cm)', waist: 'Cintura (cm)', abdomen: 'Abdómen (cm)', hip: 'Anca (cm)', calfR: 'Pant. Dir. (cm)', calfL: 'Pant. Esq. (cm)', thighR: 'Coxa Dir. (cm)', thighL: 'Coxa Esq. (cm)', armRelaxedR: 'Braço Rel. Dir. (cm)', armRelaxedL: 'Braço Rel. Esq. (cm)', armContractedR: 'Braço Cont. Dir. (cm)', armContractedL: 'Braço Cont. Esq. (cm)' };
    const skinfoldLabels = { skinfoldTriceps: 'Tríceps (mm)', skinfoldAxillary: 'Axilar Média (mm)', skinfoldChest: 'Tórax (mm)', skinfoldAbdominal: 'Abdominal (mm)', skinfoldSuprailiac: 'Supra-ilíaca (mm)', skinfoldSubscapular: 'Subescapular (mm)', skinfoldThigh: 'Coxa (mm)' };
    
    const allMeasureKeys = { weight: 'Peso (kg)', ...circumferenceLabels, ...skinfoldLabels };
    const initialMeasures = Object.keys(allMeasureKeys).reduce((acc, key) => ({ ...acc, [key]: '' }), {});
    const [newRecord, setNewRecord] = useState({...initialMeasures, date: new Date().toISOString().slice(0, 10)});
    
    const handleProfileChange = (e) => setEditableProfile({...editableProfile, [e.target.name]: e.target.value});
    const handleRecordChange = (e) => setNewRecord({...newRecord, [e.target.name]: e.target.value});
    
    const saveProfileInfo = async () => {
        try {
            await updateProfileAPI(editableProfile);
            setIsEditing(false);
        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
            alert("Não foi possível atualizar o perfil.");
        }
    };

    const addFullRecord = () => {
        const today = new Date().toISOString().slice(0, 10);
        if (newRecord.date > today) {
            alert("Não é possível registar uma medida com uma data futura.");
            return;
        }

        if (Object.values(newRecord).every(m => m === '' || m === newRecord.date)) { 
            alert("Preencha pelo menos um campo de medida para guardar o registo."); 
            return; 
        }
        
        const updatedHistory = [...(profile.measurementHistory || []), newRecord];
        try {
            updateProfileAPI({ measurementHistory: updatedHistory });
            setNewRecord({...initialMeasures, date: new Date().toISOString().slice(0, 10)});
            setIsAddingRecord(false);
            alert("Registo guardado com sucesso!");
        } catch (error) {
            console.error("Erro ao adicionar registo:", error);
            alert("Não foi possível adicionar o registo.");
        }
    };
    
    const handleDeleteRecord = async (date) => {
        const updatedHistory = profile.measurementHistory.filter(record => record.date !== date);
        try {
            await updateProfileAPI({ measurementHistory: updatedHistory });
            setRecordToDelete(null);
        } catch (error) {
            console.error("Erro ao apagar registo:", error);
            alert("Não foi possível apagar o registo.");
        }
    };

    // --- (NOVO) Funções para manipular os atalhos no modal ---
    const handleRemoveShortcut = (idToRemove) => {
        setEditedShortcuts(editedShortcuts.filter(id => id !== idToRemove));
    };

    const handleAddShortcut = (idToAdd) => {
        if (!editedShortcuts.includes(idToAdd)) {
            setEditedShortcuts([...editedShortcuts, idToAdd]);
        }
    };
    
    const handleMoveShortcut = (index, direction) => {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= editedShortcuts.length) return;
        const newList = [...editedShortcuts];
        [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]]; // Troca as posições
        setEditedShortcuts(newList);
    };

    const handleSaveShortcuts = () => {
        updateProfileAPI({ homeShortcuts: editedShortcuts });
        setIsShortcutsModalOpen(false);
    };

    // --- (NOVO) Memoiza as listas de atalhos disponíveis e visíveis ---
    const { visibleShortcuts, availableShortcuts } = useMemo(() => {
        const visible = editedShortcuts.map(id => ALL_SHORTCUT_ITEMS.find(item => item.id === id)).filter(Boolean);
        const available = ALL_SHORTCUT_ITEMS.filter(item => !editedShortcuts.includes(item.id));
        return { visibleShortcuts: visible, availableShortcuts: available };
    }, [editedShortcuts]);
    
    const sortedHistory = [...(profile.measurementHistory || [])].sort((a,b) => new Date(b.date) - new Date(a.date));
    const latestRecord = sortedHistory[0] || {};
    const previousRecord = sortedHistory[1] || {};
    
    const bmi = calculateBMI(latestRecord.weight, profile.height);
    const bodyFatPercentage = calculateBodyFat(latestRecord, profile.age, profile.gender);
    const fatMass = (bodyFatPercentage / 100) * latestRecord.weight;
    const leanMass = latestRecord.weight - fatMass;
    
    const getComparisonIcon = (key, currentValue, previousValue) => {
        if (!currentValue || !previousValue) return null;
        const current = parseFloat(currentValue);
        const previous = parseFloat(previousValue);
        if (current === previous) return null;
        const lowerIsBetter = key.includes('waist') || key.includes('hip') || key.includes('skinfold') || key.includes('abdomen');
        const improved = lowerIsBetter ? current < previous : current > previous;
        return improved ? <ArrowUpCircle className="text-green-500" size={16}/> : <ArrowDownCircle className="text-red-500" size={16}/>;
    };

    const showInfo = (type) => {
        if (type === 'bmi') { setInfoModalContent({ title: 'Cálculo de IMC', content: 'O Índice de Massa Corporal (IMC) é calculado como: Peso (kg) / [Altura (m)]².' }); } 
        else if (type === 'bf') { setInfoModalContent({ title: 'Cálculo de % Gordura Corporal', content: 'Estimado usando o protocolo de Jackson & Pollock de 7 pregas cutâneas e a equação de Siri.' }); }
    };
    
    const measuresToShow = historyTab === 'circumferences' ? { weight: 'Peso (kg)', ...circumferenceLabels } : skinfoldLabels;

    return (
        <>  
            <InfoModal isOpen={!!infoModalContent} onClose={() => setInfoModalContent(null)} title={infoModalContent?.title}><p>{infoModalContent?.content}</p></InfoModal>
            <ConfirmationModal isOpen={!!recordToDelete} onClose={() => setRecordToDelete(null)} onConfirm={() => handleDeleteRecord(recordToDelete)} title="Apagar Registo"><p>Tem a certeza que quer apagar este registo? Esta ação não pode ser desfeita.</p></ConfirmationModal>
            
            {/* --- (NOVO) Modal para Editar Atalhos --- */}
            {isShortcutsModalOpen && (
                <ModalBase onClose={() => setIsShortcutsModalOpen(false)} title="Personalizar Atalhos da Home">
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold mb-2 text-gray-300">Atalhos Visíveis (Máx. 4)</h3>
                            <div className="space-y-2 bg-gray-900/50 p-3 rounded-lg">
                                {visibleShortcuts.map((item, index) => (
                                    <div key={item.id} className="flex items-center justify-between bg-gray-700 p-2 rounded-md animate-fade-in-fast">
                                        <span className="font-medium text-white">{item.title}</span>
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => handleMoveShortcut(index, -1)} disabled={index === 0} className="btn-icon disabled:opacity-30"><ArrowUp size={20}/></button>
                                            <button onClick={() => handleMoveShortcut(index, 1)} disabled={index === visibleShortcuts.length - 1} className="btn-icon disabled:opacity-30"><ArrowDown size={20}/></button>
                                            <button onClick={() => handleRemoveShortcut(item.id)} className="btn-icon text-red-400 hover:text-red-300"><Trash2 size={20}/></button>
                                        </div>
                                    </div>
                                ))}
                                {visibleShortcuts.length === 0 && <p className="text-sm text-gray-500 text-center py-4">Nenhum atalho selecionado.</p>}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2 text-gray-300">Atalhos Disponíveis</h3>
                            <div className="flex flex-wrap gap-2">
                                {availableShortcuts.map(item => (
                                    <button key={item.id} onClick={() => handleAddShortcut(item.id)} disabled={editedShortcuts.length >= 4} className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                        <PlusCircle size={16}/> {item.title}
                                    </button>
                                ))}
                                {availableShortcuts.length === 0 && <p className="text-sm text-gray-500">Todos os atalhos já foram adicionados.</p>}
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end gap-3">
                        <button onClick={() => setIsShortcutsModalOpen(false)} className="btn-secondary">Cancelar</button>
                        <button onClick={handleSaveShortcuts} className="btn-primary">Salvar</button>
                    </div>
                </ModalBase>
            )}

            <div className="animate-fade-in">   
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-blue-400">Informações Pessoais</h2>
                        {isEditing ? <button onClick={saveProfileInfo} className="btn-primary"><Save size={18}/> Salvar</button> : <button onClick={() => setIsEditing(true)} className="btn-secondary"><Edit size={18}/> Editar</button>}
                    </div>
                    {isEditing ? (
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Nome" name="name" value={editableProfile.name} onChange={handleProfileChange} />
                            <InputField label="Altura (cm)" name="height" type="number" value={editableProfile.height} onChange={handleProfileChange} />
                            <InputField label="Idade" name="age" type="number" value={editableProfile.age} onChange={handleProfileChange} />
                            <div>
                                <label className="block mb-1 font-medium text-gray-300">Sexo</label>
                                <CustomSelect options={[{id: 'male', name: 'Masculino'}, {id: 'female', name: 'Feminino'}]} value={editableProfile.gender} onChange={(value) => setEditableProfile(p => ({...p, gender: value}))}/>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <p><strong>Nome:</strong> {profile.name}</p>
                            <p><strong>Altura:</strong> {profile.height} cm</p>
                            <p><strong>Idade:</strong> {profile.age} anos</p>
                            <p><strong>Peso:</strong> {latestRecord.weight || 'N/A'} kg</p>
                            <p className="flex items-center gap-1"><strong>IMC:</strong> {bmi > 0 ? bmi.toFixed(2) : 'N/A'} <Info onClick={() => showInfo('bmi')} size={16} className="cursor-pointer text-blue-400"/></p>
                            <p className="flex items-center gap-1"><strong>% Gordura:</strong> {bodyFatPercentage > 0 ? bodyFatPercentage.toFixed(2) + '%' : 'N/A'} <Info onClick={() => showInfo('bf')} size={16} className="cursor-pointer text-blue-400"/></p>
                            <p><strong>Massa Gorda:</strong> {fatMass > 0 ? fatMass.toFixed(2) + ' kg' : 'N/A'}</p>
                            <p><strong>Massa Magra:</strong> {leanMass > 0 ? leanMass.toFixed(2) + ' kg' : 'N/A'}</p>
                        </div>
                    )}
                </div>

                 {/* --- (NOVO) Card de Configurações com o botão para abrir o modal --- */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
                    <h2 className="text-2xl font-semibold text-blue-400 mb-4">Configurações</h2>
                    <button onClick={() => setIsShortcutsModalOpen(true)} className="w-full btn-secondary flex items-center justify-center gap-2">
                        <SlidersHorizontal size={20}/>
                        Personalizar Atalhos da Página Inicial
                    </button>
                </div>
                
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
                    <button onClick={() => setIsAddingRecord(!isAddingRecord)} className="w-full flex justify-between items-center text-left">
                        <div>
                            <h2 className="text-2xl font-semibold text-blue-400">Registo de Medidas</h2>
                            <p className="text-sm text-gray-400">Adicionar um novo registo de evolução.</p>
                        </div>
                        <PlusCircle size={24} className={`transition-transform text-blue-400 ${isAddingRecord ? 'rotate-45' : ''}`} />
                    </button>
                    {isAddingRecord && (
                        <div className="mt-4 animate-fade-in">
                            <InputField label="Data do Registo" name="date" type="date" value={newRecord.date} onChange={handleRecordChange} max={new Date().toISOString().slice(0, 10)} />
                            <div className="border-b border-gray-700 my-4 flex">
                                <button onClick={() => setActiveTab('circumferences')} className={`py-2 px-4 transition-colors ${activeTab === 'circumferences' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>Circunferências</button>
                                <button onClick={() => setActiveTab('skinfolds')} className={`py-2 px-4 transition-colors ${activeTab === 'skinfolds' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>Pregas Cutâneas</button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <InputField label="Peso (kg)" name="weight" type="number" value={newRecord.weight} onChange={handleRecordChange} small/>
                                {activeTab === 'circumferences' && Object.entries(circumferenceLabels).map(([key, label]) => (<InputField key={key} label={label} name={key} type="number" value={newRecord[key]} onChange={handleRecordChange} small/>))}
                                {activeTab === 'skinfolds' && Object.entries(skinfoldLabels).map(([key, label]) => (<InputField key={key} label={label} name={key} type="number" value={newRecord[key]} onChange={handleRecordChange} small/>))}
                            </div>
                            <button onClick={addFullRecord} className="btn-primary w-full mt-2">Guardar Registo</button>
                        </div>
                    )}
                </div>
                
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                    <button onClick={() => setIsHistoryVisible(!isHistoryVisible)} className="w-full flex justify-between items-center text-left mb-4">
                        <h2 className="text-2xl font-semibold text-blue-400">Histórico de Medidas</h2>
                        <ChevronDown size={24} className={`transition-transform text-blue-400 ${isHistoryVisible ? 'rotate-180' : ''}`} />
                    </button>
                    {isHistoryVisible && (
                        <div className="animate-fade-in">
                            <div className="border-b border-gray-700 mb-4 flex">
                                <button onClick={() => setHistoryTab('circumferences')} className={`py-2 px-4 transition-colors ${historyTab === 'circumferences' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>Circunferências</button>
                                <button onClick={() => setHistoryTab('skinfolds')} className={`py-2 px-4 transition-colors ${historyTab === 'skinfolds' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>Pregas Cutâneas</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead>
                                        <tr>
                                            <th className="p-2 sticky left-0 bg-gray-800 font-semibold z-10">Medida</th>
                                            {sortedHistory.map(entry => (
                                                <th key={entry.date} className="p-2 text-center font-semibold">
                                                    <div className="flex items-center justify-center gap-2">
                                                        {new Date(entry.date).toLocaleDateString('pt-BR')}
                                                        <button onClick={() => setRecordToDelete(entry.date)} className="btn-icon text-gray-500 hover:text-red-500"><Trash2 size={14}/></button>
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(measuresToShow).map(([key, label]) => (
                                            <tr key={key} className="border-t border-gray-700">
                                                <td className="p-2 sticky left-0 font-semibold bg-gray-800 whitespace-nowrap">{label}</td>
                                                {sortedHistory.map((entry, colIndex) => {
                                                    const isLatest = colIndex === 0;
                                                    const prev = isLatest ? previousRecord : (sortedHistory[colIndex+1] || {});
                                                    return(
                                                        <td key={entry.date} className={`p-2 text-center ${colIndex % 2 === 0 ? 'bg-gray-700/50' : ''}`}>
                                                            <div className="flex items-center justify-center gap-1">{entry[key] || '-'}{isLatest && getComparisonIcon(key, entry[key], prev[key])}</div>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
