import { Dumbbell, ClipboardList, CheckCircle, ExternalLink} from 'lucide-react';
import { calculateBMI, calculateBodyFat } from "../utils/calculations";
import { useAppContext } from '../context/AppContext';

export function HomePage() {
    const { workouts, exercises, profile, setCurrentView } = useAppContext();
//export function HomePage({ workouts, exercises, profile, setCurrentView }) {
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