import { ModalBase } from './ModalBase.js';

export function ConfirmationModal({ isOpen, onClose, onConfirm, title, children }) {
    if (!isOpen) return null;
    return (<ModalBase onClose={onClose} title={title}><div className="text-gray-300">{children}</div><div className="flex justify-end gap-4 mt-6"><button onClick={onClose} className="btn-secondary">Cancelar</button><button onClick={onConfirm} className="btn-primary bg-red-600 hover:bg-red-700">Confirmar</button></div></ModalBase>);
}