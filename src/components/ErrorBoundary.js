import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class PageErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error('PageErrorBoundary:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                    <AlertTriangle size={48} className="text-yellow-400 mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Algo correu mal nesta página</h2>
                    <p className="text-gray-400 mb-6">Ocorreu um erro inesperado. Tente novamente.</p>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <RefreshCw size={18} />
                        Tentar Novamente
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export class AppErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error('AppErrorBoundary:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8 text-center">
                    <AlertTriangle size={64} className="text-red-400 mb-6" />
                    <h1 className="text-2xl font-bold mb-2">A aplicação encontrou um erro</h1>
                    <p className="text-gray-400 mb-8">Por favor, recarregue a página para continuar.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <RefreshCw size={20} />
                        Recarregar
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
