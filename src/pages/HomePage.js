import React from 'react';
import { useAppContext } from '../context/AppContext';
import { calculateBMI, calculateBodyFat } from '../utils/calculations';
import { ClipboardList, Dumbbell, CheckCircle, ExternalLink, Activity } from 'lucide-react';

export function HomePage() {
    const { workouts, exercises, profile, history, navigateTo } = useAppContext();
    
    const lastWorkout = workouts.filter(w => w.lastCompleted).sort((a,b) => new Date(b.lastCompleted) - new Date(a.lastCompleted))[0];
    const latestRecord = profile.measurementHistory.slice(-1)[0] || {};
    const bmi = calculateBMI(latestRecord.weight, profile.height);
    const bodyFat = calculateBodyFat(latestRecord, profile.age, profile.gender);

    // Função para obter os últimos 7 dias da semana
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
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Bem-vindo, {profile.name}!</h1>
            <p className="text-gray-400 text-md md:text-lg mb-8">Pronto para superar os seus limites?</p>
            
            <div className="grid grid-cols-2 gap-4">
                <div onClick={() => navigateTo({page: 'workouts'})} className="bg-gray-800 p-4 rounded-xl shadow-lg cursor-pointer hover:bg-gray-700 transition-colors"><h2 className="text-lg font-semibold text-blue-400 flex items-center gap-2 mb-2"><ClipboardList size={20}/> Treinos</h2><p className="text-4xl font-bold text-white">{workouts.length}</p></div>
                <div onClick={() => navigateTo({page: 'exercises'})} className="bg-gray-800 p-4 rounded-xl shadow-lg cursor-pointer hover:bg-gray-700 transition-colors"><h2 className="text-lg font-semibold text-blue-400 flex items-center gap-2 mb-2"><Dumbbell size={20}/> Exercícios</h2><p className="text-4xl font-bold text-white">{exercises.length}</p></div>
                <div onClick={() => navigateTo({page: 'profile'})} className="bg-gray-800 p-4 rounded-xl shadow-lg cursor-pointer hover:bg-gray-700 transition-colors"><h2 className="text-lg font-semibold text-blue-400 mb-2">IMC</h2><p className="text-4xl font-bold text-white">{bmi > 0 ? bmi.toFixed(1) : 'N/A'}</p></div>
                <div onClick={() => navigateTo({page: 'profile'})} className="bg-gray-800 p-4 rounded-xl shadow-lg cursor-pointer hover:bg-gray-700 transition-colors"><h2 className="text-lg font-semibold text-blue-400 mb-2">% Gordura</h2><p className="text-4xl font-bold text-white">{bodyFat > 0 ? `${bodyFat.toFixed(1)}%` : 'N/A'}</p></div>

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
