import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { ModalBase } from './ModalBase';
import { Search, Check } from 'lucide-react';

export default function AddExerciseToWorkoutModal({ existingIds, onAdd, onClose }) {
    const { exercises } = useAppContext();
    const [selectedIds, setSelectedIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    const availableExercises = exercises.filter(ex => 
        !existingIds.includes(ex.id) && 
        ex.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleSelection = (id) => {
        setSelectedIds(prev => 
            prev.includes(id) 
            ? prev.filter(i => i !== id) 
            : [...prev, id]
        );
    };
    
    return (
      <ModalBase onClose={onClose} title="Adicionar Exercícios ao Treino">
          <div className="relative mb-4">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
            <input 
                type="text" 
                placeholder="Buscar exercício..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                className="w-full bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-white p-3 pl-10"
            />
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto p-1">
              {availableExercises.length > 0 ? (
                  availableExercises.map(ex => {
                       const isSelected = selectedIds.includes(ex.id);
                       return (
                        <div 
                            key={ex.id} 
                            onClick={() => toggleSelection(ex.id)} 
                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                        >
                            <div className={`w-6 h-6 border-2 rounded flex-shrink-0 flex items-center justify-center ${isSelected ? 'bg-blue-500 border-blue-400' : 'border-gray-500'}`}>
                               {isSelected && <Check size={16} className="text-white"/>}
                            </div>
                            <span>{ex.name}</span>
                        </div>
                       )
                  })
              ) : (
                <div className="text-center py-8 px-4">
                    <p className="text-gray-400">Ops, não achou o seu exercício?</p>
                    <p className="text-sm text-gray-500 mt-1">Vá ao registo e depois volte aqui para o incluir no treino.</p>
                </div>
              )}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
                <button 
                    onClick={onClose} 
                    className="w-full flex items-center justify-center gap-2 text-blue-400 font-semibold py-3 px-5 rounded-lg border-2 border-blue-600 bg-transparent hover:bg-blue-600/20 transition-colors"
                >
                    Cancelar
                </button>
                <button 
                    onClick={() => onAdd(selectedIds)} 
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-5 rounded-lg hover:bg-blue-700 transition-colors shadow"
                    disabled={selectedIds.length === 0}
                >
                    Adicionar ({selectedIds.length})
                </button>
            </div>
      </ModalBase>
    );
}
