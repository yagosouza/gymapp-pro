import React, { useState } from 'react';

import { ModalBase } from './ModalBase.js';
import { InputField } from '../ui/InputField.js';
import { useAppContext } from '../../context/AppContext.js';

export function AddExerciseToWorkoutModal({ existingIds, onAdd, onClose }) {
    const { exercises } = useAppContext();

    const [selectedIds, setSelectedIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const availableExercises = exercises.filter(ex => !existingIds.includes(ex.id) && ex.name.toLowerCase().includes(searchTerm.toLowerCase()));
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