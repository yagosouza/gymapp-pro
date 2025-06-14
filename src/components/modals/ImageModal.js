import { ModalBase } from './ModalBase.js';

export function ImageModal({ url, onClose }) {
  return (<ModalBase onClose={onClose} title="Imagem do Exercício"><img src={url} alt="Imagem do exercício" className="w-full h-auto rounded-lg" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/27272a/FFFFFF?text=Imagem+inv%C3%A1lida'; }} /></ModalBase>);
}