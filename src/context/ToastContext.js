import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const showToast = useCallback((message, type = 'info') => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 4000);
    }, [removeToast]);

    const showError = useCallback((message) => showToast(message, 'error'), [showToast]);
    const showSuccess = useCallback((message) => showToast(message, 'success'), [showToast]);

    return (
        <ToastContext.Provider value={{ showToast, showError, showSuccess, toasts, removeToast }}>
            {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}
