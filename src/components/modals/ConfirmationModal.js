import { ModalBase } from "./ModalBase.js";

export function ConfirmationModal({ isOpen, onClose, onConfirm, title, children }) {
    if (!isOpen) return null;
    
    return (
        <ModalBase onClose={onClose} title={title}>
            <div className="text-gray-300">{children}</div>
            <div className="grid grid-cols-2 gap-4 mt-6">
                <button 
                    onClick={onClose} 
                    className="w-full flex items-center justify-center gap-2 text-gray-300 font-semibold py-3 px-5 rounded-lg border-2 border-gray-600 bg-transparent hover:bg-gray-700/20 transition-colors"
                >
                    Cancelar
                </button>
                <button 
                    onClick={onConfirm} 
                    className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-3 px-5 rounded-lg hover:bg-red-700 transition-colors shadow"
                >
                    Confirmar
                </button>
            </div>
        </ModalBase>
    );
}