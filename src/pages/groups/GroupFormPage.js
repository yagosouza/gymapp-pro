import React, { useState } from "react";
import { Save, X } from "lucide-react";
import { InputField } from "../../components/ui/InputField";
import { useAppContext } from "../../context/AppContext";

export function GroupFormPage() {
  const { muscleGroups, currentView, navigateTo, muscleGroupsAPI } = useAppContext();

  const group = currentView.id ? muscleGroups.find((g) => g.id === currentView.id) : null;

  const [name, setName] = useState(group ? group.name : "");

  const onSave = () => navigateTo({ page: "groups" });
  const onCancel = () => navigateTo({ page: "groups" });

  const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        
        try {
            if (group) {
                // UPDATE
                await muscleGroupsAPI.update(group.id, { name });
            } else {
                // CREATE
                await muscleGroupsAPI.create({ name });
            }
            onSave();
        } catch (error) {
            console.error("Erro ao salvar grupo muscular: ", error);
            alert("Não foi possível salvar. Tente novamente.");
        }
    };

  return (
    <div className="animate-fade-in">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-xl space-y-4"
      >
        <InputField
          label="Nome do Grupo"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </form>
      <div className="grid grid-cols-2 gap-4 pt-4">
                           <button type="button" onClick={onCancel} className="w-full flex items-center justify-center gap-2 text-blue-400 font-semibold py-3 px-5 rounded-lg border-2 border-blue-600 hover:bg-blue-600/20 transition-colors">
                              <X size={20}/>
                              <span>Cancelar</span>
                          </button>
                          <button type="submit" onClick={handleSubmit} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-5 rounded-lg hover:bg-blue-700 transition-colors shadow">
                              <Save size={20}/>
                              <span>Salvar</span>
                          </button>
                      </div>
    </div>
  );
}
