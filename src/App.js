import React, { useState, useEffect, useRef } from 'react';
import { 
    Home, Dumbbell, ClipboardList, Plus, Trash2, Edit, Save, X, Menu, ArrowLeft, 
    Layers, Youtube, Search, CheckCircle, Clock, PlayCircle, StopCircle, User, LogOut, TrendingUp, Weight,
    ArrowUpCircle, ArrowDownCircle, ExternalLink, ChevronDown, Repeat, AlertTriangle, Image as ImageIcon, Info
} from 'lucide-react';

// --- Funções de Cálculo ---
const calculateBMI = (weight, height) => {
    if (!weight || !height) return 0;
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters));
};

const calculateBodyFat = (skinfolds, age, gender = 'male') => {
    // Jackson/Pollock 7-Site Formula.
    const { skinfoldTriceps, skinfoldAxillary, skinfoldChest, skinfoldAbdominal, skinfoldSuprailiac, skinfoldSubscapular, skinfoldThigh } = skinfolds;
    if (!skinfoldTriceps || !skinfoldAxillary || !skinfoldChest || !skinfoldAbdominal || !skinfoldSuprailiac || !skinfoldSubscapular || !skinfoldThigh || !age) return 0;
    const sumOfSkinfolds = [skinfoldTriceps, skinfoldAxillary, skinfoldChest, skinfoldAbdominal, skinfoldSuprailiac, skinfoldSubscapular, skinfoldThigh].reduce((sum, current) => sum + parseFloat(current || 0), 0);
    let bodyDensity;
    if (gender === 'male') {
        bodyDensity = 1.112 - (0.00043499 * sumOfSkinfolds) + (0.00000055 * sumOfSkinfolds * sumOfSkinfolds) - (0.00028826 * age);
    } else { // Formula for Women
        bodyDensity = 1.097 - (0.00046971 * sumOfSkinfolds) + (0.00000056 * sumOfSkinfolds * sumOfSkinfolds) - (0.00012828 * age);
    }
    if (bodyDensity <= 0) return 0;
    const bodyFatPercentage = (495 / bodyDensity) - 450;
    return bodyFatPercentage > 0 ? bodyFatPercentage : 0;
};

// --- Modelos de Dados Iniciais ---
const initialMuscleGroups = [
    { id: 1, name: 'Peito' }, { id: 2, name: 'Costas' }, { id: 3, name: 'Pernas' },
    { id: 4, name: 'Ombros' }, { id: 5, name: 'Tríceps' }, { id: 6, name: 'Bíceps' },
    { id: 7, name: 'Abdominais' }
];
const initialExercises = [
  { id: 1, name: 'Supino Reto', muscleGroupId: 1, secondaryMuscleGroupIds: [4, 5], suggestedSets: '4', suggestedReps: '10', suggestedWeight: '60', videoUrl: 'https://www.youtube.com/watch?v=rT7gLneLSvY', imageUrl: 'https://placehold.co/600x400/27272a/FFFFFF?text=M%C3%BAsculos' },
  { id: 2, name: 'Agachamento Livre', muscleGroupId: 3, secondaryMuscleGroupIds: [], suggestedSets: '5', suggestedReps: '8', suggestedWeight: '80', videoUrl: '', imageUrl: '' },
  { id: 3, name: 'Remada Curvada', muscleGroupId: 2, secondaryMuscleGroupIds: [6], suggestedSets: '4', suggestedReps: '12', suggestedWeight: '50', videoUrl: 'https://youtu.be/l1hZg8b66pA', imageUrl: '' },
];
const initialWorkouts = [{ 
    id: 1, name: 'Treino A - Peito e Tríceps', lastCompleted: null,
    exercises: [{ workoutExerciseId: 1, exerciseId: 1, sets: '4', reps: '10', weight: '60', notes: 'Focar na fase excêntrica' }] 
}];
const initialProfile = { 
    name: 'Admin', height: '180', age: '30', gender: 'male',
    measurementHistory: [
        { 
            date: '2025-06-10', weight: '80', 
            shoulder: '120', chest: '105', waist: '85', abdomen: '88', hip: '100', 
            calfR: '40', calfL: '40', thighR: '60', thighL: '60',
            armRelaxedR: '36', armRelaxedL: '36', armContractedR: '38', armContractedL: '38',
            skinfoldTriceps: '10', skinfoldAxillary: '12', skinfoldChest: '12', skinfoldAbdominal: '20', 
            skinfoldSuprailiac: '12', skinfoldSubscapular: '15', skinfoldThigh: '15'
        }
    ]
};
const initialHistory = [];

// --- Componentes de UI Genéricos ---
const InputField = ({ label, small, ...props }) => (<div>{label && <label className={`block mb-1 font-medium ${small ? 'text-xs text-gray-400' : 'text-gray-300'}`}>{label}</label>}<input {...props} className={`w-full bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-white ${small ? 'p-2 text-sm' : 'p-3'}`}/></div>);
const GlobalStyles = () => (<style>{`.btn-primary { @apply flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow disabled:opacity-50 disabled:cursor-not-allowed; } .btn-secondary { @apply flex items-center justify-center gap-2 bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors shadow; } .btn-icon { @apply p-2 rounded-full hover:bg-gray-700 transition-colors; } .input-base { @apply w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-white; } @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in { animation: fade-in 0.5s ease-out forwards; } @keyframes fade-in-fast { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out forwards; }`}</style>);

function CustomSelect({ options, value, onChange, placeholder = "Selecione..." }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);
    const selectedOption = options.find(opt => opt.id === value);
    useEffect(() => {
        const handleClickOutside = (event) => { if (ref.current && !ref.current.contains(event.target)) setIsOpen(false); };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ref]);
    const handleSelect = (optionValue) => { onChange(optionValue); setIsOpen(false); };
    return (
        <div className="relative" ref={ref}>
            <button type="button" onClick={() => setIsOpen(!isOpen)} className="input-base w-full flex justify-between items-center text-left bg-gray-600 hover:bg-gray-500 transition-colors">
                <span className={selectedOption ? 'text-white' : 'text-gray-400'}>{selectedOption ? selectedOption.name : placeholder}</span>
                <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute z-10 top-full mt-1 w-full bg-gray-800 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {options.map(opt => (<button key={opt.id} type="button" onClick={() => handleSelect(opt.id)} className="block w-full text-left px-4 py-2 text-white hover:bg-blue-600">{opt.name}</button>))}
                </div>
            )}
        </div>
    );
}

// --- Componentes de Modal ---
function ModalBase({ onClose, title, children }) {
  useEffect(() => { const handleEsc = (e) => { if (e.key === 'Escape') onClose(); }; window.addEventListener('keydown', handleEsc); return () => window.removeEventListener('keydown', handleEsc); }, [onClose]);
  return (<div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in-fast"><div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg" role="dialog" aria-modal="true"><div className="flex justify-between items-center p-4 border-b border-gray-700"><h3 className="text-xl font-semibold text-white">{title}</h3><button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700"><X size={24}/></button></div><div className="p-6 overflow-y-auto max-h-[80vh]">{children}</div></div></div>);
}

function ConfirmationModal({ isOpen, onClose, onConfirm, title, children }) {
    if (!isOpen) return null;
    return (<ModalBase onClose={onClose} title={title}><div className="text-gray-300">{children}</div><div className="flex justify-end gap-4 mt-6"><button onClick={onClose} className="btn-secondary">Cancelar</button><button onClick={onConfirm} className="btn-primary bg-red-600 hover:bg-red-700">Confirmar</button></div></ModalBase>);
}

function InfoModal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;
    return (<ModalBase onClose={onClose} title={title}><div className="text-gray-300 space-y-2">{children}</div><div className="flex justify-end mt-6"><button onClick={onClose} className="btn-primary">Entendido</button></div></ModalBase>);
}

function YouTubePlayerModal({ url, onClose }) {
  const getYouTubeId = (url) => { let ID = ''; url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/); if (url[2] !== undefined) { ID = url[2].split(/[^0-9a-z_\-]/i); ID = ID[0]; } else { ID = url; } return ID; };
  const videoId = getYouTubeId(url);
  return (<ModalBase onClose={onClose} title="Visualizador de Vídeo"><div className="aspect-video bg-black rounded-lg">{videoId ? (<iframe className="w-full h-full" src={`https://www.youtube.com/embed/${videoId}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>) : <p className="text-red-400 text-center p-8">URL do YouTube inválida.</p>}</div></ModalBase>);
}

function ImageModal({ url, onClose }) {
  return (<ModalBase onClose={onClose} title="Imagem do Exercício"><img src={url} alt="Imagem do exercício" className="w-full h-auto rounded-lg" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/27272a/FFFFFF?text=Imagem+inv%C3%A1lida'; }} /></ModalBase>);
}

function HistoryModal({ exercise, history, onClose }) {
    const exerciseHistory = history
        .flatMap(h => h.exerciseLogs.map(log => ({ ...log, date: h.completionDate })))
        .filter(log => log.exerciseId === exercise.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    return (
        <ModalBase onClose={onClose} title={`Histórico de Carga: ${exercise.name}`}>
            <ul className="space-y-3 max-h-96 overflow-y-auto">
                {exerciseHistory.map((log, i) => (<li key={i} className="bg-gray-700 p-3 rounded-lg flex justify-between items-center"><div><p className="font-semibold">{new Date(log.date).toLocaleDateString('pt-BR')}</p><p className="text-sm text-gray-400">Séries: {log.sets} | Reps: {log.reps}</p></div><p className="text-lg font-bold text-blue-400">{log.weight} kg</p></li>))}
                {exerciseHistory.length === 0 && <p className="text-gray-400 text-center py-4">Nenhum histórico encontrado.</p>}
            </ul>
        </ModalBase>
    );
}

function AddExerciseToWorkoutModal({ allExercises, existingIds, onAdd, onClose }) {
    const [selectedIds, setSelectedIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const availableExercises = allExercises.filter(ex => !existingIds.includes(ex.id) && ex.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const toggleSelection = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    return (
      <ModalBase onClose={onClose} title="Adicionar Exercícios ao Treino">
          <InputField type="text" placeholder="Buscar exercício..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} small/>
          <div className="space-y-2 max-h-72 overflow-y-auto p-1 mt-4">
              {availableExercises.map(ex => (<div key={ex.id} onClick={() => toggleSelection(ex.id)} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedIds.includes(ex.id) ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}><div className={`w-5 h-5 border-2 rounded flex-shrink-0 ${selectedIds.includes(ex.id) ? 'bg-blue-500 border-blue-400' : 'border-gray-500'}`}></div><span>{ex.name}</span></div>))}
          </div>
          <div className="mt-6 flex justify-end gap-4"><button onClick={onClose} className="btn-secondary">Cancelar</button><button onClick={() => onAdd(selectedIds)} className="btn-primary" disabled={selectedIds.length === 0}>Adicionar ({selectedIds.length})</button></div>
      </ModalBase>
    );
}

// --- Componentes de Página ---
function LoginPage({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = (e) => { e.preventDefault(); onLogin(username, password); };
    return (
        <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
            <GlobalStyles /><form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-sm space-y-6 animate-fade-in"><div className="text-center"><Dumbbell size={48} className="mx-auto text-blue-400" /><h1 className="text-3xl font-bold mt-2">GymApp Pro</h1><p className="text-gray-400">Faça login para continuar</p></div><InputField label="Utilizador" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin (ou deixe em branco)" /><InputField label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="admin (ou deixe em branco)" /><button type="submit" className="w-full btn-primary !py-3">Entrar</button></form>
        </div>
    );
}

function HomePage({ workouts, exercises, profile, setCurrentView }) {
    const lastWorkout = workouts.filter(w => w.lastCompleted).sort((a,b) => new Date(b.lastCompleted) - new Date(a.lastCompleted))[0];
    const latestRecord = profile.measurementHistory.slice(-1)[0] || {};
    const bmi = calculateBMI(latestRecord.weight, profile.height);
    const bodyFat = calculateBodyFat(latestRecord, profile.age, profile.gender);
    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Bem-vindo, {profile.name}!</h1>
            <p className="text-gray-400 text-md md:text-lg mb-8">Pronto para superar os seus limites?</p>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 p-4 rounded-xl shadow-lg"><h2 className="text-lg font-semibold text-blue-400 flex items-center gap-2 mb-2"><ClipboardList size={20}/> Treinos</h2><p className="text-4xl font-bold text-white">{workouts.length}</p></div>
                <div className="bg-gray-800 p-4 rounded-xl shadow-lg"><h2 className="text-lg font-semibold text-blue-400 flex items-center gap-2 mb-2"><Dumbbell size={20}/> Exercícios</h2><p className="text-4xl font-bold text-white">{exercises.length}</p></div>
                <div className="bg-gray-800 p-4 rounded-xl shadow-lg"><h2 className="text-lg font-semibold text-blue-400 mb-2">IMC</h2><p className="text-4xl font-bold text-white">{bmi > 0 ? bmi.toFixed(1) : 'N/A'}</p></div>
                <div className="bg-gray-800 p-4 rounded-xl shadow-lg"><h2 className="text-lg font-semibold text-blue-400 mb-2">% Gordura</h2><p className="text-4xl font-bold text-white">{bodyFat > 0 ? `${bodyFat.toFixed(1)}%` : 'N/A'}</p></div>
                <div onClick={() => setCurrentView({page: 'workouts'})} className="bg-gray-800 p-6 rounded-xl shadow-lg col-span-2 cursor-pointer hover:bg-gray-700 transition-colors">
                    <div className="flex justify-between items-center"><h2 className="text-lg font-semibold text-blue-400 flex items-center gap-2"><CheckCircle size={20}/> Último Treino</h2><ExternalLink size={20} className="text-gray-500"/></div>
                    {lastWorkout ? (<div className="mt-2"><p className="font-bold text-white">{lastWorkout.name}</p><p className="text-gray-400 text-sm">{new Date(lastWorkout.lastCompleted).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</p></div>) : <p className="text-gray-400 mt-2 text-sm">Nenhum treino concluído ainda. Clique para ver os treinos.</p>}
                </div>
            </div>
        </div>
    );
}

function ProfilePage({ profile, setProfile }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editableProfile, setEditableProfile] = useState({ name: profile.name, height: profile.height, age: profile.age, gender: profile.gender });
    const [activeTab, setActiveTab] = useState('circumferences');
    const [infoModalContent, setInfoModalContent] = useState(null);
    const [isClearHistoryModalOpen, setIsClearHistoryModalOpen] = useState(false);

    const circumferenceLabels = { shoulder: 'Ombro (cm)', chest: 'Peitoral (cm)', waist: 'Cintura (cm)', abdomen: 'Abdómen (cm)', hip: 'Anca (cm)', calfR: 'Pant. Dir. (cm)', calfL: 'Pant. Esq. (cm)', thighR: 'Coxa Dir. (cm)', thighL: 'Coxa Esq. (cm)', armRelaxedR: 'Braço Rel. Dir. (cm)', armRelaxedL: 'Braço Rel. Esq. (cm)', armContractedR: 'Braço Cont. Dir. (cm)', armContractedL: 'Braço Cont. Esq. (cm)' };
    const skinfoldLabels = { skinfoldTriceps: 'Tríceps (mm)', skinfoldAxillary: 'Axilar Média (mm)', skinfoldChest: 'Tórax (mm)', skinfoldAbdominal: 'Abdominal (mm)', skinfoldSuprailiac: 'Supra-ilíaca (mm)', skinfoldSubscapular: 'Subescapular (mm)', skinfoldThigh: 'Coxa (mm)' };
    const allMeasureKeys = { weight: 'Peso (kg)', ...circumferenceLabels, ...skinfoldLabels };
    
    const initialMeasures = Object.keys(allMeasureKeys).reduce((acc, key) => ({ ...acc, [key]: '' }), {});
    const [newRecord, setNewRecord] = useState({...initialMeasures, date: new Date().toISOString().slice(0, 10)});
    
    const handleProfileChange = (e) => setEditableProfile({...editableProfile, [e.target.name]: e.target.value});
    const handleRecordChange = (e) => setNewRecord({...newRecord, [e.target.name]: e.target.value});
    const saveProfileInfo = () => { setProfile(p => ({ ...p, ...editableProfile })); setIsEditing(false); };

    const addFullRecord = () => {
        if (Object.values(newRecord).every(m => m === '' || m === newRecord.date)) { alert("Preencha pelo menos um campo de medida."); return; }
        setProfile(p => ({ ...p, measurementHistory: [...p.measurementHistory, newRecord]}));
        setNewRecord({...initialMeasures, date: new Date().toISOString().slice(0, 10)});
        alert("Registo guardado com sucesso!");
    };
    
    const clearHistory = () => {
        setProfile(p => ({ ...p, measurementHistory: [] }));
        setIsClearHistoryModalOpen(false);
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
        if (type === 'bmi') {
            setInfoModalContent({ title: 'Cálculo de IMC', content: 'O Índice de Massa Corporal (IMC) é calculado como: Peso (kg) / [Altura (m)]².' });
        } else if (type === 'bf') {
            setInfoModalContent({ title: 'Cálculo de % Gordura Corporal', content: 'Estimado usando o protocolo de Jackson & Pollock de 7 pregas cutâneas e a equação de Siri. Requer as pregas do tórax, axilar média, tríceps, subescapular, abdominal, suprailíaca e coxa, para além da idade e sexo.' });
        }
    };
    
    return (
        <div className="animate-fade-in">
            <InfoModal isOpen={!!infoModalContent} onClose={() => setInfoModalContent(null)} title={infoModalContent?.title}><p>{infoModalContent?.content}</p></InfoModal>
            <ConfirmationModal isOpen={isClearHistoryModalOpen} onClose={() => setIsClearHistoryModalOpen(false)} onConfirm={clearHistory} title="Limpar Histórico"><p>Tem a certeza que quer apagar TODOS os registos de medições? Esta ação não pode ser desfeita.</p></ConfirmationModal>
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
                <h2 className="text-2xl font-semibold text-blue-400 mb-4">Adicionar Novo Registo</h2>
                <InputField label="Data do Registo" name="date" type="date" value={newRecord.date} onChange={handleRecordChange} />
                <div className="border-b border-gray-700 my-4 flex"><button onClick={() => setActiveTab('circumferences')} className={`py-2 px-4 transition-colors ${activeTab === 'circumferences' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>Circunferências</button><button onClick={() => setActiveTab('skinfolds')} className={`py-2 px-4 transition-colors ${activeTab === 'skinfolds' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>Pregas Cutâneas</button></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                     <InputField label="Peso (kg)" name="weight" type="number" value={newRecord.weight} onChange={handleRecordChange} small/>
                     {activeTab === 'circumferences' && Object.entries(circumferenceLabels).map(([key, label]) => (<InputField key={key} label={label} name={key} type="number" value={newRecord[key]} onChange={handleRecordChange} small/>))}
                     {activeTab === 'skinfolds' && Object.entries(skinfoldLabels).map(([key, label]) => (<InputField key={key} label={label} name={key} type="number" value={newRecord[key]} onChange={handleRecordChange} small/>))}
                </div><button onClick={addFullRecord} className="btn-primary w-full mt-2">Guardar Registo</button>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-semibold text-blue-400">Histórico de Medidas</h2><button onClick={() => setIsClearHistoryModalOpen(true)} className="btn-secondary bg-red-800/60 hover:bg-red-800/80 text-sm !py-1"><Trash2 size={14}/> Limpar</button></div>
                <div className="overflow-x-auto"><table className="w-full text-left text-sm whitespace-nowrap"><thead><tr className="border-b border-gray-700"><th className="p-2 sticky left-0 bg-gray-800">Data</th>{Object.values(allMeasureKeys).map(label => <th key={label} className="p-2 text-center">{label.split(' ')[0]}</th>)}</tr></thead><tbody>{sortedHistory.map((entry, index) => { const isLatest = index === 0; const prev = isLatest ? previousRecord : (sortedHistory[index+1] || {}); return (<tr key={index} className="border-b border-gray-700/50 hover:bg-gray-700/50"><td className="p-2 font-semibold sticky left-0 bg-gray-800">{new Date(entry.date).toLocaleDateString('pt-BR')}</td>{Object.keys(allMeasureKeys).map(key => <td key={key} className="p-2 text-center"><div className="flex items-center justify-center gap-1">{entry[key] || '-'}{isLatest && getComparisonIcon(key, entry[key], prev[key])}</div></td>)}</tr>) })}</tbody></table></div>
            </div>
        </div>
    );
}

function ListPageContainer({ pageTitle, itemType, setCurrentView, muscleGroups, exercises, setExercises, setMuscleGroups, history }) {
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

function GroupFormPage({ group, onSave, onCancel, muscleGroups, setMuscleGroups }){
    const [name, setName] = useState(group ? group.name : '');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        if (group) { setMuscleGroups(muscleGroups.map(g => g.id === group.id ? { ...g, name } : g));
        } else { setMuscleGroups([...muscleGroups, { id: Date.now(), name }]); }
        onSave();
    };
    return (<div className="animate-fade-in"><div className="flex justify-between items-center mb-6"><h1 className="text-3xl font-bold text-white">{group ? 'Editar' : 'Novo'} Grupo</h1><div className="flex gap-4"><button onClick={onCancel} className="btn-secondary"><X size={20}/> Cancelar</button><button type="submit" onClick={handleSubmit} className="btn-primary"><Save size={20}/> Salvar</button></div></div><form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl space-y-4"><InputField label="Nome do Grupo" value={name} onChange={e => setName(e.target.value)} autoFocus /></form></div>);
}

function ExerciseFormPage({ exercise, onSave, onCancel, exercises, setExercises, muscleGroups }){
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

function WorkoutEditor({ workout, onSave, onCancel, allExercises, history }) {
    const [editedWorkout, setEditedWorkout] = useState(workout);
    const [isSelecting, setIsSelecting] = useState(false);
    const [videoModalUrl, setVideoModalUrl] = useState(null);
    const [historyModalExercise, setHistoryModalExercise] = useState(null);
    const handleNameChange = (e) => setEditedWorkout({ ...editedWorkout, name: e.target.value });
    const handleAddExercises = (selectedIds) => {
        const newExercises = selectedIds.map(id => { const ex = allExercises.find(e => e.id === id); return { workoutExerciseId: Date.now() + id, exerciseId: ex.id, sets: ex.suggestedSets || '3', reps: ex.suggestedReps || '10', weight: ex.suggestedWeight || '', notes: '' }; });
        setEditedWorkout({ ...editedWorkout, exercises: [...editedWorkout.exercises, ...newExercises] });
        setIsSelecting(false);
    };
    const handleUpdateExerciseDetail = (workoutExId, field, value) => { const updated = editedWorkout.exercises.map(ex => ex.workoutExerciseId === workoutExId ? { ...ex, [field]: value } : ex); setEditedWorkout({ ...editedWorkout, exercises: updated }); };
    const handleRemoveExercise = (workoutExId) => { setEditedWorkout({ ...editedWorkout, exercises: editedWorkout.exercises.filter(ex => ex.workoutExerciseId !== workoutExId) }); };
    const getExerciseDetails = (id) => allExercises.find(e => e.id === id) || {};
    const exerciseHasHistory = (exId) => history.some(h => h.exerciseLogs.some(l => l.exerciseId === exId));

    return (
        <div className="animate-fade-in pb-20">
             {isSelecting && <AddExerciseToWorkoutModal allExercises={allExercises} existingIds={editedWorkout.exercises.map(e => e.exerciseId)} onAdd={handleAddExercises} onClose={() => setIsSelecting(false)} />}
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

function WorkoutsPage({ workouts, setWorkouts, allExercises, onStartWorkout, history, setCurrentView }) {
    const [itemToDelete, setItemToDelete] = useState(null);
    const calculateAverageTime = (workout) => { const totalSets = workout.exercises.reduce((acc, ex) => acc + (parseInt(ex.sets, 10) || 0), 0); return totalSets * 2; };
    const handleCreate = () => setCurrentView({ page: 'workouts', mode: 'edit', id: null });
    const handleEdit = (workout) => setCurrentView({ page: 'workouts', mode: 'edit', id: workout.id });
    const handleDelete = (id) => { setWorkouts(workouts.filter(w => w.id !== id)); setItemToDelete(null); };
    
    return (
        <div className="animate-fade-in pb-24">
            <ConfirmationModal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)} onConfirm={() => handleDelete(itemToDelete)} title="Apagar Treino"><p>Tem a certeza que quer apagar este treino? Esta ação não pode ser desfeita.</p></ConfirmationModal>
            <h1 className="text-4xl font-bold text-white mb-6">Os Seus Treinos</h1>
            <div className="space-y-6">
                {workouts.map(w => (
                    <div key={w.id} className="bg-gray-800 rounded-xl shadow-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-semibold text-blue-400">{w.name}</h2>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-400"><span>{w.exercises.length} exercícios</span><span className="flex items-center gap-1"><Clock size={14}/> ~{calculateAverageTime(w)} min</span></div>
                                    {w.lastCompleted && <p className="text-xs text-gray-500 mt-1">Última vez: {new Date(w.lastCompleted).toLocaleString('pt-BR', {dateStyle: 'short', timeStyle: 'short'})}</p>}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => onStartWorkout(w.id)} className="btn-icon text-green-400 hover:bg-green-800/50"><PlayCircle size={24}/></button>
                                    <button onClick={() => handleEdit(w)} className="btn-icon text-gray-400 hover:text-yellow-400"><Edit size={20}/></button>
                                    <button onClick={() => setItemToDelete(w.id)} className="btn-icon text-gray-400 hover:text-red-500"><Trash2 size={20}/></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
             <button onClick={handleCreate} className="fixed bottom-8 right-8 btn-primary !rounded-full !p-4 z-10 shadow-lg animate-fade-in" aria-label="Criar Novo Treino"><Plus size={28}/></button>
        </div>
    );
}

function TrainingModePage({ workout, setWorkouts, allExercises, backToList, setHistory, history, activeSession, setActiveSession }) {
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const getExerciseDetails = (id) => allExercises.find(e => e.id === id) || {};
    const exerciseHasHistory = (exId) => history.some(h => h.exerciseLogs.some(l => l.exerciseId === exId));
    useEffect(() => {
        const currentWorkout = workout;
        const currentSessionLogs = activeSession.logs;
        const updatedLogs = { ...currentSessionLogs };
        let hasChanged = false;
        currentWorkout.exercises.forEach(ex => {
            if (!updatedLogs[ex.workoutExerciseId]) { updatedLogs[ex.workoutExerciseId] = { sets: ex.sets, reps: ex.reps, weight: ex.weight || '', completed: false }; hasChanged = true; }
        });
        Object.keys(updatedLogs).forEach(logId => { if (!currentWorkout.exercises.some(ex => ex.workoutExerciseId == logId)) { delete updatedLogs[logId]; hasChanged = true; } });
        if(hasChanged) { setActiveSession(prev => ({ ...prev, logs: updatedLogs })); }
    }, [workout.exercises, activeSession.logs, setActiveSession]);
    const handleLogChange = (workoutExId, field, value) => {
        const newLogs = { ...activeSession.logs, [workoutExId]: { ...activeSession.logs[workoutExId], [field]: value } };
        setActiveSession(prev => ({ ...prev, logs: newLogs }));
        setWorkouts(currentWorkouts => currentWorkouts.map(w => w.id === workout.id ? { ...w, exercises: w.exercises.map(ex => ex.workoutExerciseId === workoutExId ? { ...ex, [field]: value } : ex) } : w ));
    };
    const toggleComplete = (workoutExId) => {
        const newLogs = { ...activeSession.logs };
        newLogs[workoutExId].completed = !newLogs[workoutExId].completed;
        setActiveSession(prev => ({ ...prev, logs: newLogs }));
    };
    const finishWorkout = () => {
        const newHistoryEntry = { id: Date.now(), workoutId: workout.id, workoutName: workout.name, completionDate: new Date().toISOString(), exerciseLogs: workout.exercises.map(ex => ({ exerciseId: ex.exerciseId, name: getExerciseDetails(ex.exerciseId).name, sets: activeSession.logs[ex.workoutExerciseId].sets, reps: activeSession.logs[ex.workoutExerciseId].reps, weight: activeSession.logs[ex.workoutExerciseId].weight })) };
        setHistory(prev => [...prev, newHistoryEntry]);
        setWorkouts(prev => prev.map(w => w.id === workout.id ? { ...w, lastCompleted: new Date().toISOString() } : w));
        setActiveSession(null); backToList();
    };
    const confirmCancelWorkout = () => { setActiveSession(null); backToList(); }
    return (
        <div className="animate-fade-in pb-28">
            <ConfirmationModal isOpen={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)} onConfirm={confirmCancelWorkout} title="Cancelar Treino"><p>Tem a certeza que quer cancelar o treino? O progresso não será guardado.</p></ConfirmationModal>
            <h1 className="text-3xl font-bold text-white truncate mb-4">{workout.name}</h1>
            <div className="space-y-4">
                {workout.exercises.map(ex => {
                    const log = activeSession.logs[ex.workoutExerciseId];
                    if (!log) return null; 
                    const isCompleted = log.completed || false;
                    const fullExercise = getExerciseDetails(ex.exerciseId);
                    return (
                        <div key={ex.workoutExerciseId} className={`p-4 rounded-lg transition-all duration-300 ${isCompleted ? 'bg-green-900/50' : 'bg-gray-800'}`}>
                           <div className="flex items-start gap-4">
                                <div onClick={() => toggleComplete(ex.workoutExerciseId)} className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-all mt-1 cursor-pointer ${isCompleted ? 'bg-green-500 border-green-400' : 'border-gray-500'}`}>{isCompleted && <CheckCircle size={24} className="text-white"/>}</div>
                                <div className="flex-grow">
                                    <div className="flex items-center justify-between"><p className={`font-bold text-xl ${isCompleted ? 'line-through text-gray-500' : 'text-white'}`}>{fullExercise.name}</p><div className="flex items-center gap-2">{exerciseHasHistory(ex.exerciseId) && <button className="btn-icon text-gray-400 hover:text-green-400"><TrendingUp size={18}/></button>}{fullExercise.videoUrl && <button className="btn-icon text-gray-400 hover:text-red-500"><Youtube size={18}/></button>}</div></div>
                                    <div className="mt-3 grid grid-cols-3 gap-3"><InputField label="Séries" type="number" small value={log.sets} onChange={e => handleLogChange(ex.workoutExerciseId, 'sets', e.target.value)}/><InputField label="Reps" type="number" small value={log.reps} onChange={e => handleLogChange(ex.workoutExerciseId, 'reps', e.target.value)}/><InputField label="Peso (kg)" type="number" small value={log.weight} onChange={e => handleLogChange(ex.workoutExerciseId, 'weight', e.target.value)}/></div>
                                </div>
                           </div>
                        </div>
                    );
                })}
            </div>
             <div className="mt-8 grid grid-cols-1 gap-4">
                <button onClick={finishWorkout} className="w-full btn-primary bg-green-600 hover:bg-green-700 !py-3"><StopCircle size={20}/><span>Finalizar e Salvar Treino</span></button>
                <button onClick={() => setIsCancelModalOpen(true)} className="w-full btn-secondary bg-red-800/60 hover:bg-red-800/80 !py-2">Cancelar Treino</button>
            </div>
        </div>
    );
}

// --- Componentes de Navegação e Estrutura ---
function Sidebar({ currentView, setCurrentView, isSidebarOpen, setIsSidebarOpen, onLogout, activeWorkoutName, onReturnToWorkout }) {
  const navItems = [ { id: 'home', label: 'Início', icon: Home }, { id: 'profile', label: 'Meu Perfil', icon: User }, { id: 'groups', label: 'Grupos Musculares', icon: Layers }, { id: 'exercises', label: 'Exercícios', icon: Dumbbell }, { id: 'workouts', label: 'Treinos', icon: ClipboardList }, ];
  return (
       <>
        <div className={`fixed inset-0 bg-black/60 z-30 md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)}></div>
        <aside className={`absolute md:relative flex flex-col bg-gray-800 shadow-lg z-40 h-full transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-64`}>
          <div className="p-4 border-b border-gray-700 flex justify-between items-center"><h1 className="text-2xl font-bold text-white flex items-center gap-2"><Dumbbell className="text-blue-400"/> GymApp</h1><button onClick={() => setIsSidebarOpen(false)} className="p-1 rounded-md hover:bg-gray-700 md:hidden"><ArrowLeft size={20} /></button></div>
          <nav className="flex-1 p-2 space-y-1">
            {activeWorkoutName && (
                <div className="p-2">
                    <button onClick={onReturnToWorkout} className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-lg bg-green-600/80 text-white font-semibold shadow-md animate-pulse">
                        <Repeat size={24}/>
                        <span>{activeWorkoutName}</span>
                    </button>
                </div>
            )}
            {navItems.map(item => (<button key={item.id} onClick={() => { setCurrentView({ page: item.id }); if (window.innerWidth < 768) setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-lg transition-colors ${currentView.page === item.id ? 'bg-blue-600 text-white font-semibold shadow-md' : 'hover:bg-gray-700 text-gray-300'}`}><item.icon size={24} /><span>{item.label}</span></button>))}
          </nav>
          <div className="p-2"><button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-lg hover:bg-red-800/50 text-red-400 transition-colors"><LogOut size={24}/><span>Sair</span></button></div>
        </aside>
     </>
  );
}

function GymAppPro({ onLogout }) {
  const useStickyState = (defaultValue, key) => {
    const [value, setValue] = useState(() => { const stickyValue = window.localStorage.getItem(key); return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue; });
    useEffect(() => { window.localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
    return [value, setValue];
  };

  const [muscleGroups, setMuscleGroups] = useStickyState(initialMuscleGroups, 'muscleGroups');
  const [exercises, setExercises] = useStickyState(initialExercises, 'exercises');
  const [workouts, setWorkouts] = useStickyState(initialWorkouts, 'workouts');
  const [profile, setProfile] = useStickyState(initialProfile, 'profile');
  const [history, setHistory] = useStickyState(initialHistory, 'history');
  
  const [currentView, setCurrentView] = useState({ page: 'home' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSession, setActiveSession] = useStickyState(null, 'activeWorkoutSession');

  const startWorkoutSession = (workoutId) => {
    const workoutToStart = workouts.find(w => w.id === workoutId);
    if (!workoutToStart) return;
    setActiveSession({
        workoutId: workoutId,
        logs: workoutToStart.exercises.reduce((acc, ex) => {
            acc[ex.workoutExerciseId] = { sets: ex.sets, reps: ex.reps, weight: ex.weight || '', completed: false };
            return acc;
        }, {})
    });
    setCurrentView({ page: 'workouts', mode: 'training' });
  };
  
  useEffect(() => { if (window.innerWidth < 768) setIsSidebarOpen(false); }, []);

  const renderPage = () => {
    switch (currentView.page) {
      case 'home': return <HomePage workouts={workouts} exercises={exercises} history={history} profile={profile} setCurrentView={setCurrentView} />;
      case 'profile': return <ProfilePage profile={profile} setProfile={setProfile} />;
      case 'groups': 
        if(currentView.mode === 'create'){ 
            return <GroupFormPage onSave={() => setCurrentView({page: 'groups'})} onCancel={() => setCurrentView({page: 'groups'})} muscleGroups={muscleGroups} setMuscleGroups={setMuscleGroups} />; 
        }
        if(currentView.mode === 'edit'){ 
            const group = muscleGroups.find(g => g.id === currentView.id); 
            return <GroupFormPage group={group} onSave={() => setCurrentView({page: 'groups'})} onCancel={() => setCurrentView({page: 'groups'})} muscleGroups={muscleGroups} setMuscleGroups={setMuscleGroups} />; 
        }
        return <ListPageContainer pageTitle="Grupos Musculares" itemType="groups" setCurrentView={setCurrentView} muscleGroups={muscleGroups} setMuscleGroups={setMuscleGroups} exercises={exercises} />;
      case 'exercises':
        if (currentView.mode === 'create') { 
            return <ExerciseFormPage onSave={() => setCurrentView({ page: 'exercises' })} onCancel={() => setCurrentView({ page: 'exercises' })} exercises={exercises} setExercises={setExercises} muscleGroups={muscleGroups} />; 
        }
        if (currentView.mode === 'edit') { 
            const exercise = exercises.find(ex => ex.id === currentView.id); 
            return <ExerciseFormPage exercise={exercise} onSave={() => setCurrentView({ page: 'exercises' })} onCancel={() => setCurrentView({ page: 'exercises' })} exercises={exercises} setExercises={setExercises} muscleGroups={muscleGroups} />; 
        }
        return <ListPageContainer pageTitle="Exercícios" itemType="exercises" setCurrentView={setCurrentView} exercises={exercises} setExercises={setExercises} muscleGroups={muscleGroups} history={history} />;
      case 'workouts':
        if (currentView.mode === 'training' && activeSession) {
          const workout = workouts.find(w => w.id === activeSession.workoutId);
          if (!workout) { 
            setActiveSession(null); 
            return <WorkoutsPage workouts={workouts} setWorkouts={setWorkouts} allExercises={exercises} setCurrentView={setCurrentView} onStartWorkout={startWorkoutSession} history={history} />; 
        }
          return <TrainingModePage workout={workout} setWorkouts={setWorkouts} allExercises={exercises} backToList={() => setCurrentView({ page: 'workouts'})} setHistory={setHistory} history={history} activeSession={activeSession} setActiveSession={setActiveSession} />;
        }
        if (currentView.mode === 'edit') {
            const workout = currentView.id ? workouts.find(w => w.id === currentView.id) : { name: 'Novo Treino', exercises: [] };
            const handleSave = (editedWorkout) => {
                if (currentView.id) { 
                    setWorkouts(workouts.map(w => w.id === currentView.id ? editedWorkout : w));
                } else { 
                    setWorkouts([...workouts, {...editedWorkout, id: Date.now()}]); 
                }
                setCurrentView({ page: 'workouts' });
            };
            return <WorkoutEditor workout={workout} onSave={handleSave} onCancel={() => setCurrentView({ page: 'workouts' })} allExercises={exercises} history={history} /> 
        }
        return <WorkoutsPage workouts={workouts} setWorkouts={setWorkouts} allExercises={exercises} setCurrentView={setCurrentView} onStartWorkout={startWorkoutSession} history={history} />;
      default: return <HomePage workouts={workouts} exercises={exercises} history={history} profile={profile} setCurrentView={setCurrentView} />;
    }
  };
  
  const activeWorkout = activeSession ? workouts.find(w => w.id === activeSession.workoutId) : null;

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200 font-sans">
      <GlobalStyles />
      <Sidebar 
          currentView={currentView} 
          setCurrentView={setCurrentView} 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen} 
          onLogout={onLogout} 
          activeWorkoutName={activeWorkout?.name} 
          onReturnToWorkout={() => setCurrentView({ page: 'workouts', mode: 'training' })}
      />
      <main className="flex-1 flex flex-col overflow-y-auto transition-all duration-300">
         <div className="p-4 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-20 flex items-center md:hidden"><button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-md hover:bg-gray-700"><Menu size={24} /></button><h1 className="text-xl font-semibold ml-4">GymApp Pro</h1></div>
        <div className="p-4 sm:p-6 lg:p-8 flex-1">{renderPage()}</div>
      </main>
    </div>
  );
}

// --- Componente Raiz (Gerencia Autenticação) ---
export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const handleLogin = (username, password) => {
        if ((username === 'admin' && password === 'admin') || (username === '' && password === '')) { setIsLoggedIn(true);
        } else { alert('Utilizador ou senha inválidos'); }
    };
    const handleLogout = () => {
        // Limpa a sessão ativa ao fazer logout
        localStorage.removeItem('activeWorkoutSession');
        setIsLoggedIn(false); 
    };
    if (!isLoggedIn) { return <LoginPage onLogin={handleLogin} />; }
    return <GymAppPro onLogout={handleLogout} />;
}
