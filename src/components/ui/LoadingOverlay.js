import React from 'react';
import { Loader } from 'lucide-react';

/**
 * Exibe uma sobreposição de carregamento em tela cheia.
 * @param {object} props
 * @param {boolean} props.isActive - Controla a visibilidade do overlay.
 * @param {string} [props.message='A processar...'] - A mensagem a ser exibida sob o spinner.
 */
export function LoadingOverlay({ isActive, message = 'A processar...' }) {
    if (!isActive) return null;

    return (
        <div 
            className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[100] flex flex-col items-center justify-center animate-fade-in-fast"
            aria-live="assertive" 
            role="alert"
        >
            <Loader size={48} className="text-blue-400 animate-spin" />
            <p className="mt-4 text-white text-lg font-semibold">{message}</p>
        </div>
    );
}