import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { calculateBMI, calculateBodyFat } from '../../utils/calculations';
import { Edit, Save, Trash2, Info, PlusCircle, ArrowUpCircle, ArrowDownCircle, ChevronDown } from 'lucide-react';
import { InputField } from '../../components/ui/InputField';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { ConfirmationModal } from '../../components/modals/ConfirmationModal';
import { InfoModal } from '../../components/modals/InfoModal';

export function ProfilePage() {
    const { profile, setProfile } = useAppContext();
    const [isEditing, setIsEditing] = useState(false);
    const [isAddingRecord, setIsAddingRecord] = useState(false);
    const [isHistoryVisible, setIsHistoryVisible] = useState(false); // Histórico começa fechado
    const [editableProfile, setEditableProfile] = useState({ name: profile.name, height: profile.height, age: profile.age, gender: profile.gender });
    const [activeTab, setActiveTab] = useState('circumferences');
    const [historyTab, setHistoryTab] = useState('circumferences');
    const [infoModalContent, setInfoModalContent] = useState(null);
    const [recordToDelete, setRecordToDelete] = useState(null);

    const circumferenceLabels = { shoulder: 'Ombro (cm)', chest: 'Peitoral (cm)', waist: 'Cintura (cm)', abdomen: 'Abdómen (cm)', hip: 'Anca (cm)', calfR: 'Pant. Dir. (cm)', calfL: 'Pant. Esq. (cm)', thighR: 'Coxa Dir. (cm)', thighL: 'Coxa Esq. (cm)', armRelaxedR: 'Braço Rel. Dir. (cm)', armRelaxedL: 'Braço Rel. Esq. (cm)', armContractedR: 'Braço Cont. Dir. (cm)', armContractedL: 'Braço Cont. Esq. (cm)' };
    const skinfoldLabels = { skinfoldTriceps: 'Tríceps (mm)', skinfoldAxillary: 'Axilar Média (mm)', skinfoldChest: 'Tórax (mm)', skinfoldAbdominal: 'Abdominal (mm)', skinfoldSuprailiac: 'Supra-ilíaca (mm)', skinfoldSubscapular: 'Subescapular (mm)', skinfoldThigh: 'Coxa (mm)' };
    
    const allMeasureKeys = { weight: 'Peso (kg)', ...circumferenceLabels, ...skinfoldLabels };
    
    const initialMeasures = Object.keys(allMeasureKeys).reduce((acc, key) => ({ ...acc, [key]: '' }), {});
    const [newRecord, setNewRecord] = useState({...initialMeasures, date: new Date().toISOString().slice(0, 10)});
    
    const handleProfileChange = (e) => setEditableProfile({...editableProfile, [e.target.name]: e.target.value});
    const handleRecordChange = (e) => setNewRecord({...newRecord, [e.target.name]: e.target.value});
    const saveProfileInfo = () => { setProfile(p => ({ ...p, ...editableProfile })); setIsEditing(false); };

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
        
        setProfile(p => ({ ...p, measurementHistory: [...p.measurementHistory, newRecord]}));
        setNewRecord({...initialMeasures, date: new Date().toISOString().slice(0, 10)});
        setIsAddingRecord(false);
        alert("Registo guardado com sucesso!");
    };
    
    const handleDeleteRecord = (date) => {
        setProfile(p => ({ ...p, measurementHistory: p.measurementHistory.filter(record => record.date !== date) }));
        setRecordToDelete(null);
    }
    
    const sortedHistory = [...profile.measurementHistory].sort((a,b) => new Date(b.date) - new Date(a.date));
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
        <div className="animate-fade-in">
            <InfoModal isOpen={!!infoModalContent} onClose={() => setInfoModalContent(null)} title={infoModalContent?.title}><p>{infoModalContent?.content}</p></InfoModal>
            <ConfirmationModal isOpen={!!recordToDelete} onClose={() => setRecordToDelete(null)} onConfirm={() => handleDeleteRecord(recordToDelete)} title="Apagar Registo"><p>Tem a certeza que quer apagar este registo? Esta ação não pode ser desfeita.</p></ConfirmationModal>
            
            <h1 className="text-4xl font-bold text-white mb-6">Meu Perfil</h1>
            
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
                <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-semibold text-blue-400">Informações Pessoais</h2>{isEditing ? <button onClick={saveProfileInfo} className="btn-primary"><Save size={18}/> Salvar</button> : <button onClick={() => setIsEditing(true)} className="btn-secondary"><Edit size={18}/> Editar</button>}</div>
                 {isEditing ? (
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Nome" name="name" value={editableProfile.name} onChange={handleProfileChange} /><InputField label="Altura (cm)" name="height" type="number" value={editableProfile.height} onChange={handleProfileChange} /><InputField label="Idade" name="age" type="number" value={editableProfile.age} onChange={handleProfileChange} /><div><label className="block mb-1 font-medium text-gray-300">Sexo</label><CustomSelect options={[{id: 'male', name: 'Masculino'}, {id: 'female', name: 'Feminino'}]} value={editableProfile.gender} onChange={(value) => setEditableProfile(p => ({...p, gender: value}))}/></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <p><strong>Nome:</strong> {profile.name}</p><p><strong>Altura:</strong> {profile.height} cm</p>
                        <p><strong>Idade:</strong> {profile.age} anos</p><p><strong>Peso:</strong> {latestRecord.weight || 'N/A'} kg</p>
                        <p className="flex items-center gap-1"><strong>IMC:</strong> {bmi > 0 ? bmi.toFixed(2) : 'N/A'} <Info onClick={() => showInfo('bmi')} size={16} className="cursor-pointer text-blue-400"/></p>
                        <p className="flex items-center gap-1"><strong>% Gordura:</strong> {bodyFatPercentage > 0 ? bodyFatPercentage.toFixed(2) + '%' : 'N/A'} <Info onClick={() => showInfo('bf')} size={16} className="cursor-pointer text-blue-400"/></p>
                        <p><strong>Massa Gorda:</strong> {fatMass > 0 ? fatMass.toFixed(2) + ' kg' : 'N/A'}</p><p><strong>Massa Magra:</strong> {leanMass > 0 ? leanMass.toFixed(2) + ' kg' : 'N/A'}</p>
                    </div>
                )}
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
                        <div className="border-b border-gray-700 my-4 flex"><button onClick={() => setActiveTab('circumferences')} className={`py-2 px-4 transition-colors ${activeTab === 'circumferences' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>Circunferências</button><button onClick={() => setActiveTab('skinfolds')} className={`py-2 px-4 transition-colors ${activeTab === 'skinfolds' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>Pregas Cutâneas</button></div>
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
                        <div className="border-b border-gray-700 mb-4 flex"><button onClick={() => setHistoryTab('circumferences')} className={`py-2 px-4 transition-colors ${historyTab === 'circumferences' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>Circunferências</button><button onClick={() => setHistoryTab('skinfolds')} className={`py-2 px-4 transition-colors ${historyTab === 'skinfolds' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>Pregas Cutâneas</button></div>
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
                                    {Object.entries(measuresToShow).map(([key, label], rowIndex) => (
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
    );
}




// export function ProfilePage() {
//     const { profile, setProfile } = useAppContext();
//     const [isEditing, setIsEditing] = useState(false);
//     const [editableProfile, setEditableProfile] = useState({ name: profile.name, height: profile.height, age: profile.age, gender: profile.gender });
//     const [activeTab, setActiveTab] = useState('circumferences');
//     const [infoModalContent, setInfoModalContent] = useState(null);
//     const [isClearHistoryModalOpen, setIsClearHistoryModalOpen] = useState(false);

//     const circumferenceLabels = { shoulder: 'Ombro (cm)', chest: 'Peitoral (cm)', waist: 'Cintura (cm)', abdomen: 'Abdómen (cm)', hip: 'Anca (cm)', calfR: 'Pant. Dir. (cm)', calfL: 'Pant. Esq. (cm)', thighR: 'Coxa Dir. (cm)', thighL: 'Coxa Esq. (cm)', armRelaxedR: 'Braço Rel. Dir. (cm)', armRelaxedL: 'Braço Rel. Esq. (cm)', armContractedR: 'Braço Cont. Dir. (cm)', armContractedL: 'Braço Cont. Esq. (cm)' };
//     const skinfoldLabels = { skinfoldTriceps: 'Tríceps (mm)', skinfoldAxillary: 'Axilar Média (mm)', skinfoldChest: 'Tórax (mm)', skinfoldAbdominal: 'Abdominal (mm)', skinfoldSuprailiac: 'Supra-ilíaca (mm)', skinfoldSubscapular: 'Subescapular (mm)', skinfoldThigh: 'Coxa (mm)' };
//     const allMeasureKeys = { weight: 'Peso (kg)', ...circumferenceLabels, ...skinfoldLabels };
    
//     const initialMeasures = Object.keys(allMeasureKeys).reduce((acc, key) => ({ ...acc, [key]: '' }), {});
//     const [newRecord, setNewRecord] = useState({...initialMeasures, date: new Date().toISOString().slice(0, 10)});
    
//     const handleProfileChange = (e) => setEditableProfile({...editableProfile, [e.target.name]: e.target.value});
//     const handleRecordChange = (e) => setNewRecord({...newRecord, [e.target.name]: e.target.value});
//     const saveProfileInfo = () => { setProfile(p => ({ ...p, ...editableProfile })); setIsEditing(false); };

//     const addFullRecord = () => {
//         if (Object.values(newRecord).every(m => m === '' || m === newRecord.date)) { alert("Preencha pelo menos um campo de medida."); return; }
//         setProfile(p => ({ ...p, measurementHistory: [...p.measurementHistory, newRecord]}));
//         setNewRecord({...initialMeasures, date: new Date().toISOString().slice(0, 10)});
//         alert("Registo guardado com sucesso!");
//     };
    
//     const clearHistory = () => {
//         setProfile(p => ({ ...p, measurementHistory: [] }));
//         setIsClearHistoryModalOpen(false);
//     }
    
//     const sortedHistory = [...profile.measurementHistory].sort((a,b) => new Date(b.date) - new Date(a.date));
//     const latestRecord = sortedHistory[0] || {};
//     const previousRecord = sortedHistory[1] || {};
    
//     const bmi = calculateBMI(latestRecord.weight, profile.height);
//     const bodyFatPercentage = calculateBodyFat(latestRecord, profile.age, profile.gender);
//     const fatMass = (bodyFatPercentage / 100) * latestRecord.weight;
//     const leanMass = latestRecord.weight - fatMass;
    
//     const getComparisonIcon = (key, currentValue, previousValue) => {
//         if (!currentValue || !previousValue) return null;
//         const current = parseFloat(currentValue);
//         const previous = parseFloat(previousValue);
//         if (current === previous) return null;
//         const lowerIsBetter = key.includes('waist') || key.includes('hip') || key.includes('skinfold') || key.includes('abdomen');
//         const improved = lowerIsBetter ? current < previous : current > previous;
//         return improved ? <ArrowUpCircle className="text-green-500" size={16}/> : <ArrowDownCircle className="text-red-500" size={16}/>;
//     };

//     const showInfo = (type) => {
//         if (type === 'bmi') {
//             setInfoModalContent({ title: 'Cálculo de IMC', content: 'O Índice de Massa Corporal (IMC) é calculado como: Peso (kg) / [Altura (m)]².' });
//         } else if (type === 'bf') {
//             setInfoModalContent({ title: 'Cálculo de % Gordura Corporal', content: 'Estimado usando o protocolo de Jackson & Pollock de 7 pregas cutâneas e a equação de Siri. Requer as pregas do tórax, axilar média, tríceps, subescapular, abdominal, suprailíaca e coxa, para além da idade e sexo.' });
//         }
//     };
    
//     return (
//         <div className="animate-fade-in">
//             <InfoModal isOpen={!!infoModalContent} onClose={() => setInfoModalContent(null)} title={infoModalContent?.title}><p>{infoModalContent?.content}</p></InfoModal>
//             <ConfirmationModal isOpen={isClearHistoryModalOpen} onClose={() => setIsClearHistoryModalOpen(false)} onConfirm={clearHistory} title="Limpar Histórico"><p>Tem a certeza que quer apagar TODOS os registos de medições? Esta ação não pode ser desfeita.</p></ConfirmationModal>
//             <h1 className="text-4xl font-bold text-white mb-6">Meu Perfil</h1>
            
//             <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
//                 <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-semibold text-blue-400">Informações Pessoais</h2>{isEditing ? <button onClick={saveProfileInfo} className="btn-primary"><Save size={18}/> Salvar</button> : <button onClick={() => setIsEditing(true)} className="btn-secondary"><Edit size={18}/> Editar</button>}</div>
//                  {isEditing ? (
//                     <div className="grid grid-cols-2 gap-4">
//                         <InputField label="Nome" name="name" value={editableProfile.name} onChange={handleProfileChange} /><InputField label="Altura (cm)" name="height" type="number" value={editableProfile.height} onChange={handleProfileChange} /><InputField label="Idade" name="age" type="number" value={editableProfile.age} onChange={handleProfileChange} /><div><label className="block mb-1 font-medium text-gray-300">Sexo</label><CustomSelect options={[{id: 'male', name: 'Masculino'}, {id: 'female', name: 'Feminino'}]} value={editableProfile.gender} onChange={(value) => setEditableProfile(p => ({...p, gender: value}))}/></div>
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-2 gap-4 text-sm">
//                         <p><strong>Nome:</strong> {profile.name}</p><p><strong>Altura:</strong> {profile.height} cm</p>
//                         <p><strong>Idade:</strong> {profile.age} anos</p><p><strong>Peso:</strong> {latestRecord.weight || 'N/A'} kg</p>
//                         <p className="flex items-center gap-1"><strong>IMC:</strong> {bmi > 0 ? bmi.toFixed(2) : 'N/A'} <Info onClick={() => showInfo('bmi')} size={16} className="cursor-pointer text-blue-400"/></p>
//                         <p className="flex items-center gap-1"><strong>% Gordura:</strong> {bodyFatPercentage > 0 ? bodyFatPercentage.toFixed(2) + '%' : 'N/A'} <Info onClick={() => showInfo('bf')} size={16} className="cursor-pointer text-blue-400"/></p>
//                         <p><strong>Massa Gorda:</strong> {fatMass > 0 ? fatMass.toFixed(2) + ' kg' : 'N/A'}</p><p><strong>Massa Magra:</strong> {leanMass > 0 ? leanMass.toFixed(2) + ' kg' : 'N/A'}</p>
//                     </div>
//                 )}
//             </div>

//             <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
//                 <h2 className="text-2xl font-semibold text-blue-400 mb-4">Adicionar Novo Registo</h2>
//                 <InputField label="Data do Registo" name="date" type="date" value={newRecord.date} onChange={handleRecordChange} />
//                 <div className="border-b border-gray-700 my-4 flex"><button onClick={() => setActiveTab('circumferences')} className={`py-2 px-4 transition-colors ${activeTab === 'circumferences' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>Circunferências</button><button onClick={() => setActiveTab('skinfolds')} className={`py-2 px-4 transition-colors ${activeTab === 'skinfolds' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>Pregas Cutâneas</button></div>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
//                      <InputField label="Peso (kg)" name="weight" type="number" value={newRecord.weight} onChange={handleRecordChange} small/>
//                      {activeTab === 'circumferences' && Object.entries(circumferenceLabels).map(([key, label]) => (<InputField key={key} label={label} name={key} type="number" value={newRecord[key]} onChange={handleRecordChange} small/>))}
//                      {activeTab === 'skinfolds' && Object.entries(skinfoldLabels).map(([key, label]) => (<InputField key={key} label={label} name={key} type="number" value={newRecord[key]} onChange={handleRecordChange} small/>))}
//                 </div><button onClick={addFullRecord} className="btn-primary w-full mt-2">Guardar Registo</button>
//             </div>
//             <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
//                 <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-semibold text-blue-400">Histórico de Medidas</h2><button onClick={() => setIsClearHistoryModalOpen(true)} className="btn-secondary bg-red-800/60 hover:bg-red-800/80 text-sm !py-1"><Trash2 size={14}/> Limpar</button></div>
//                 <div className="overflow-x-auto"><table className="w-full text-left text-sm whitespace-nowrap"><thead><tr className="border-b border-gray-700"><th className="p-2 sticky left-0 bg-gray-800">Data</th>{Object.values(allMeasureKeys).map(label => <th key={label} className="p-2 text-center">{label.split(' ')[0]}</th>)}</tr></thead><tbody>{sortedHistory.map((entry, index) => { const isLatest = index === 0; const prev = isLatest ? previousRecord : (sortedHistory[index+1] || {}); return (<tr key={index} className="border-b border-gray-700/50 hover:bg-gray-700/50"><td className="p-2 font-semibold sticky left-0 bg-gray-800">{new Date(entry.date).toLocaleDateString('pt-BR')}</td>{Object.keys(allMeasureKeys).map(key => <td key={key} className="p-2 text-center"><div className="flex items-center justify-center gap-1">{entry[key] || '-'}{isLatest && getComparisonIcon(key, entry[key], prev[key])}</div></td>)}</tr>) })}</tbody></table></div>
//             </div>
//         </div>
//     );
// }