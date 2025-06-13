import { ModalBase } from './ModalBase.js';

export function InfoModal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;
    return (<ModalBase onClose={onClose} title={title}><div className="text-gray-300 space-y-2">{children}</div><div className="flex justify-end mt-6"><button onClick={onClose} className="btn-primary">Entendido</button></div></ModalBase>);
}