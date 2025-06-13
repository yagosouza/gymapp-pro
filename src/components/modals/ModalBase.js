import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function ModalBase({ onClose, title, children }) {
  useEffect(() => { const handleEsc = (e) => { if (e.key === 'Escape') onClose(); }; window.addEventListener('keydown', handleEsc); return () => window.removeEventListener('keydown', handleEsc); }, [onClose]);
  return (<div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in-fast"><div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg" role="dialog" aria-modal="true"><div className="flex justify-between items-center p-4 border-b border-gray-700"><h3 className="text-xl font-semibold text-white">{title}</h3><button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700"><X size={24}/></button></div><div className="p-6 overflow-y-auto max-h-[80vh]">{children}</div></div></div>);
}