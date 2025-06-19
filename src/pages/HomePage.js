import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { calculateBMI, calculateBodyFat } from '../utils/calculations';
import { ClipboardList, Dumbbell, CheckCircle, ExternalLink, Activity, BarChart3, Percent } from 'lucide-react';


const ALL_SHORTCUT_ITEMS = [
    { id: 'workouts', title: 'Treinos', Icon: ClipboardList, navigateToConfig: { page: 'workouts' } },
    { id: 'exercises', title: 'Exercícios', Icon: Dumbbell, navigateToConfig: { page: 'exercises' } },
    { id: 'bmi', title: 'IMC', Icon: BarChart3, navigateToConfig: { page: 'profile' } },
    { id: 'bodyFat', title: 'Gordura', Icon: Percent, navigateToConfig: { page: 'profile' } }
];

export function HomePage() {
    const { workouts, exercises, profile, history, navigateTo } = useAppContext();
    
    // --- 1. Os cálculos permanecem os mesmos ---
    const lastWorkout = workouts.filter(w => w.lastCompleted).sort((a,b) => new Date(b.lastCompleted) - new Date(a.lastCompleted))[0];
    const latestRecord = (profile && profile.measurementHistory && profile.measurementHistory.length > 0)
        ? profile.measurementHistory.slice(-1)[0]
        : {};
    const bmi = calculateBMI(latestRecord.weight, profile.height);
    const bodyFat = calculateBodyFat(latestRecord, profile.age, profile.gender);
    const greeting = profile.gender === 'female' ? 'Bem-vinda' : 'Bem-vindo';

    // --- 2. (NOVO) Criamos o array de atalhos dinâmicos ---
    const shortcutItems = useMemo(() => {
        // Usa a lista do perfil ou uma lista padrão com 4 itens
        const shortcutIds = profile.homeShortcuts || ['workouts', 'exercises', 'bmi', 'bodyFat'];

        return shortcutIds.map(id => {
            const item = ALL_SHORTCUT_ITEMS.find(sc => sc.id === id);
            if (!item) return null;

            // Adiciona o valor dinâmico a cada atalho
            let value;
            switch (id) {
                case 'workouts': value = workouts.length; break;
                case 'exercises': value = exercises.length; break;
                case 'bmi': value = bmi > 0 ? bmi.toFixed(1) : 'N/A'; break;
                case 'bodyFat': value = bodyFat > 0 ? `${bodyFat.toFixed(1)}%` : 'N/A'; break;
                default: value = '';
            }
            return { ...item, value };
        }).filter(Boolean); // Remove itens nulos se um ID salvo for inválido

    }, [profile, workouts, exercises, bmi, bodyFat]);

    const getPastSevenDays = () => {
        const days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
        const result = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            result.push({
                date: d.toDateString(),
                dayInitial: days[d.getDay()]
            });
        }
        return result;
    };

    const weekDays = getPastSevenDays();
    const trainedDays = new Set(history.map(h => new Date(h.completionDate).toDateString()));
    const todayString = new Date().toDateString();

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{greeting}, {profile.name}!</h1>
            <p className="text-gray-400 text-md md:text-lg mb-8">Pronto(a) para superar os seus limites?</p>
            
            {/* --- 3. (ALTERADO) O JSX agora mapeia o array de atalhos --- */}
            <div className="grid grid-cols-2 gap-4">
                {shortcutItems.map(item => (
                    <div 
                        key={item.id}
                        onClick={() => navigateTo(item.navigateToConfig)} 
                        className="bg-gray-800 p-4 rounded-xl shadow-lg cursor-pointer hover:bg-gray-700 transition-colors"
                    >
                        <h2 className="text-lg font-semibold text-blue-400 flex items-center gap-2 mb-2">
                            <item.Icon size={20}/> 
                            {item.title}
                        </h2>
                        <p className="text-4xl font-bold text-white">{item.value}</p>
                    </div>
                ))}

                {/* Os outros cards permanecem como estão */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg col-span-2">
                    <h2 className="text-lg font-semibold text-blue-400 flex items-center gap-2 mb-4"><Activity size={20}/> Frequência Semanal</h2>
                    <div className="flex justify-around">
                        {weekDays.map(({ date, dayInitial }) => {
                            const isTrained = trainedDays.has(date);
                            const isToday = date === todayString;
                            return (
                                <div key={date} className="flex flex-col items-center gap-2">
                                    <span className="text-xs text-gray-400">{dayInitial}</span>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isTrained ? 'bg-blue-600' : 'bg-gray-700'} ${isToday ? 'ring-2 ring-blue-400' : ''}`}>
                                        {isTrained && <CheckCircle size={16} className="text-white"/>}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                
                <div onClick={() => navigateTo({page: 'workouts'})} className="bg-gray-800 p-6 rounded-xl shadow-lg col-span-2 cursor-pointer hover:bg-gray-700 transition-colors">
                    <div className="flex justify-between items-center"><h2 className="text-lg font-semibold text-blue-400 flex items-center gap-2"><CheckCircle size={20}/> Último Treino</h2><ExternalLink size={20} className="text-gray-500"/></div>
                    {lastWorkout ? (<div className="mt-2"><p className="font-bold text-white">{lastWorkout.name}</p><p className="text-gray-400 text-sm">{new Date(lastWorkout.lastCompleted).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</p></div>) : <p className="text-gray-400 mt-2 text-sm">Nenhum treino concluído ainda. Clique para ver os treinos.</p>}
                </div>
            </div>
        </div>
    );
}
