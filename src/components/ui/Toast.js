import React from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const TYPE_STYLES = {
    success: 'bg-green-800 border-green-600 text-green-100',
    error: 'bg-red-900 border-red-600 text-red-100',
    info: 'bg-blue-900 border-blue-600 text-blue-100',
    warning: 'bg-yellow-900 border-yellow-600 text-yellow-100',
};

const TYPE_ICONS = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertCircle,
};

function ToastItem({ toast, onRemove }) {
    const Icon = TYPE_ICONS[toast.type] || Info;
    return (
        <div className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-fade-in-fast max-w-sm ${TYPE_STYLES[toast.type] || TYPE_STYLES.info}`}>
            <Icon size={20} className="flex-shrink-0 mt-0.5" />
            <p className="flex-grow text-sm font-medium">{toast.message}</p>
            <button onClick={() => onRemove(toast.id)} className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity">
                <X size={16} />
            </button>
        </div>
    );
}

export function ToastContainer() {
    const { toasts, removeToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-20 md:bottom-6 right-4 z-[200] flex flex-col gap-2">
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
        </div>
    );
}
