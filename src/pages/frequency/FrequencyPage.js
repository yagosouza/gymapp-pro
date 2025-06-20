import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { CheckCircle, ChevronLeft, ChevronRight, History } from 'lucide-react';

// Componente para a visão semanal (reaproveitado da HomePage)
function WeeklyFrequencyView({ history }) {
    const getPastSevenDays = () => {
        const days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
        const result = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            result.push({ date: d, dayInitial: days[d.getDay()] });
        }
        return result;
    };

    const weekDays = getPastSevenDays();
    const trainedDays = new Set(history.map(h => new Date(h.completionDate).toDateString()));
    const todayString = new Date().toDateString();

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-full">
            <h2 className="text-xl font-semibold text-blue-400 mb-4">Frequência da Última Semana</h2>
            <div className="flex justify-around">
                {weekDays.map(({ date, dayInitial }) => {
                    const isTrained = trainedDays.has(date.toDateString());
                    const isToday = date.toDateString() === todayString;
                    return (
                        <div key={date} className="flex flex-col items-center gap-2">
                            <span className="text-xs text-gray-400">{dayInitial}</span>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isTrained ? 'bg-blue-600' : 'bg-gray-700'} ${isToday ? 'ring-2 ring-blue-400' : ''}`}>
                                {isTrained && <CheckCircle size={20} className="text-white"/>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Componente principal da página
export function FrequencyPage() {
    const { history } = useAppContext();
    const [currentDate, setCurrentDate] = useState(new Date());

    // --- (ALTERADO) Memoiza o histórico já ordenado para reuso ---
    const sortedHistory = useMemo(() => 
        [...history].sort((a, b) => new Date(b.completionDate) - new Date(a.completionDate))
    , [history]);

    const trainedDaysSet = useMemo(() => 
        new Set(history.map(h => new Date(h.completionDate).toLocaleDateString('pt-BR')))
    , [history]);

    const changeMonth = (amount) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + amount);
            return newDate;
        });
    };

    const monthYear = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(currentDate);
    
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const today = new Date();

    const workoutsThisMonth = history.filter(h => {
        const d = new Date(h.completionDate);
        return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
    });

    return (
        // --- (ALTERADO) Container principal agora centraliza e limita a largura máxima ---
        <div className="animate-fade-in max-w-7xl mx-auto space-y-8 mb-8">
            
            {/* --- (NOVO) Grid para layout responsivo (2 colunas no desktop) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <WeeklyFrequencyView history={history} />

                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={() => changeMonth(-1)} className="btn-icon"><ChevronLeft size={24} /></button>
                        <h2 className="text-xl font-semibold text-blue-400 capitalize">{monthYear}</h2>
                        <button onClick={() => changeMonth(1)} className="btn-icon"><ChevronRight size={24} /></button>
                    </div>

                    <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-gray-400 mb-2">
                        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(day => <div key={day}>{day}</div>)}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`}></div>)}
                        {daysArray.map(day => {
                            const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toLocaleDateString('pt-BR');
                            const isTrained = trainedDaysSet.has(dateStr);
                            const isToday = day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();

                            return (
                                <div key={day} className={`w-full aspect-square rounded-full flex items-center justify-center text-sm font-semibold ${isTrained ? 'bg-blue-600 text-white' : 'bg-gray-700/50'} ${isToday ? 'ring-2 ring-blue-400' : ''}`}>
                                    {day}
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="mt-6 border-t border-gray-700 pt-4 text-center">
                        <p className="text-lg">Treinos este mês: <span className="font-bold text-blue-400">{workoutsThisMonth.length}</span></p>
                    </div>
                </div>
            </div>

            {/* --- (NOVO) Card com a lista de treinos recentes --- */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold text-blue-400 mb-4 flex items-center gap-2">
                    <History size={20}/>
                    Histórico de Treinos Recentes
                </h2>
                <ul className="space-y-3 max-h-96 overflow-y-auto">
                    {sortedHistory.map(h => (
                        <li key={h.id} className="flex justify-between items-center bg-gray-700/50 p-3 rounded-lg">
                            <span className="font-semibold text-white">{h.workoutName}</span>
                            <span className="text-sm text-gray-400">
                                {new Date(h.completionDate).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })}
                            </span>
                        </li>
                    ))}
                    {sortedHistory.length === 0 && (
                        <p className="text-center text-gray-500 py-4">Nenhum treino concluído ainda.</p>
                    )}
                </ul>
            </div>
        </div>
    );
}