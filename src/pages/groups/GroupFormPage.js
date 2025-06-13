import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { InputField } from '../../components/ui/InputField';
import { useAppContext } from '../../context/AppContext';

export function GroupFormPage({ group, onSave, onCancel }) {
    const { muscleGroups, setMuscleGroups } = useAppContext();
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