// src/pages/auth/LoginPage.js (versão atualizada e completa)

import React, { useState } from 'react';
import { Dumbbell } from 'lucide-react';
import { InputField } from '../../components/ui/InputField';
import { GlobalStyles } from '../../components/ui/GlobalStyles';
import { APP_VERSION } from '../../constants/initialData'; //
import { auth } from '../../firebase/config';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    sendPasswordResetEmail 
} from "firebase/auth";
import { LoadingOverlay } from '../../components/ui/LoadingOverlay';

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginView, setIsLoginView] = useState(true); // Estado para controlar a visão
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert('Por favor, preencha o e-mail e a senha.');
            return;
        }

        setIsLoading(true);

        if (isLoginView) {
            // --- LÓGICA DE LOGIN ---
            try {
                await signInWithEmailAndPassword(auth, email, password);
                // O listener em App.js irá lidar com o redirecionamento
            } catch (error) {
                alert(`Erro ao fazer login: ${error.message}`);
                setIsLoading(false);
            }
        } else {
            // --- LÓGICA DE CADASTRO ---
            try {
                await createUserWithEmailAndPassword(auth, email, password);
                // O listener em App.js irá lidar com o login automático após o cadastro
            } catch (error) {
                alert(`Erro ao criar conta: ${error.message}`);
                setIsLoading(false);
            }
        }
    };

    // --- FUNÇÃO PARA RECUPERAR SENHA ---
    const handleForgotPassword = async () => {
        const userEmail = prompt("Por favor, insira o seu e-mail para recuperar a senha:");
        if (!userEmail) {
            return; // O utilizador cancelou
        }
        setIsLoading(true);
        try {
            await sendPasswordResetEmail(auth, userEmail);
            alert('Um e-mail para recuperação de senha foi enviado para o seu endereço.');
        } catch (error) {
            alert(`Erro ao enviar e-mail de recuperação: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <>
            <LoadingOverlay isActive={isLoading} message={isLoginView ? 'Entrando...' : 'Criando conta...'} />

            <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
            <GlobalStyles />
            <div className="w-full max-w-sm">
                <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full space-y-6 animate-fade-in">
                    <div className="text-center">
                        <Dumbbell size={48} className="mx-auto text-blue-400" />
                        <h1 className="text-3xl font-bold mt-2">GymApp Pro</h1>
                        <p className="text-gray-400">{isLoginView ? 'Faça login para continuar' : 'Crie a sua conta'}</p>
                    </div>
                    {/* Campos de E-mail e Senha */}
                    <InputField label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
                    <InputField label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Sua senha" />

                    <button type="submit" className="w-full btn-primary !py-3">
                        {isLoginView ? 'Entrar' : 'Cadastrar'}
                    </button>

                    <div className="text-center text-sm">
                        <button type="button" onClick={() => setIsLoginView(!isLoginView)} className="text-blue-400 hover:underline">
                            {isLoginView ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
                        </button>
                        <span className="text-gray-500 mx-2">|</span>
                        <button type="button" onClick={handleForgotPassword} className="text-blue-400 hover:underline">
                            Esqueceu a senha?
                        </button>
                    </div>
                </form>
                <p className="text-center text-xs text-gray-600 mt-4">Versão {APP_VERSION}</p>
            </div>
        </div>
        </>  
    );
}