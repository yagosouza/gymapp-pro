import React, { useState } from 'react';
import { Dumbbell } from 'lucide-react';
import { InputField } from '../../components/ui/InputField';
import { GlobalStyles } from '../../components/ui/GlobalStyles';
import { APP_VERSION } from '../../constants/initialData';

export function LoginPage({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = (e) => { e.preventDefault(); onLogin(username, password); };
    
    return (
        <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
            <GlobalStyles />
            <div className="w-full max-w-sm">
                <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full space-y-6 animate-fade-in">
                    <div className="text-center">
                        <Dumbbell size={48} className="mx-auto text-blue-400" />
                        <h1 className="text-3xl font-bold mt-2">GymApp Pro</h1>
                        <p className="text-gray-400">Faça login para continuar</p>
                    </div>
                    <InputField label="Utilizador" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin (ou deixe em branco)" />
                    <InputField label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="admin (ou deixe em branco)" />
                    <button type="submit" className="w-full btn-primary !py-3">Entrar</button>
                </form>
                <p className="text-center text-xs text-gray-600 mt-4">Versão {APP_VERSION}</p>
            </div>
        </div>
    );
}