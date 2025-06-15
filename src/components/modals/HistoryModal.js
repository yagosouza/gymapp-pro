import { ModalBase } from './ModalBase.js';

export default function HistoryModal({ exercise, history, onClose }) {
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