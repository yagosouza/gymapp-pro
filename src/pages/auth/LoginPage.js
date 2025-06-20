import React, { useState } from 'react';
import { Dumbbell, AlertTriangle } from 'lucide-react'; 
import { InputField } from '../../components/ui/InputField';
import { GlobalStyles } from '../../components/ui/GlobalStyles';
import { APP_VERSION } from '../../constants/initialData'; //
import { auth, db } from '../../firebase/config';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    sendPasswordResetEmail 
} from "firebase/auth";
import { collection, doc, writeBatch } from "firebase/firestore"; 
import { initialData } from '../../constants/initialData';
import { LoadingOverlay } from '../../components/ui/LoadingOverlay';

const getFriendlyErrorMessage = (error) => {
    switch (error.code) {
        case 'auth/invalid-email':
            return 'O formato do e-mail é inválido.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return 'E-mail ou senha inválidos. Por favor, tente novamente.';
        case 'auth/email-already-in-use':
            return 'Este e-mail já está em uso por outra conta.';
        case 'auth/weak-password':
            return 'A senha é muito fraca. Use pelo menos 6 caracteres.';
        default:
            console.error("Firebase Auth Error:", error);
            return 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
    }
};

const createInitialUserData = async (userId) => {
    try {
        const batch = writeBatch(db);

        // Criar o perfil inicial
        const profileRef = doc(db, 'users', userId, 'profile', 'data');
        batch.set(profileRef, initialData.profile);

        // Criar mapa para guardar IDs dos grupos
        const groupMap = new Map();
        initialData.muscleGroups.forEach(group => {
            const groupRef = doc(collection(db, 'users', userId, 'muscleGroups'));
            batch.set(groupRef, group);
            groupMap.set(group.name.toLowerCase(), groupRef.id);
        });
        
        // Criar os exercícios, associando os IDs
        initialData.exercises.forEach(exercise => {
            const exerciseRef = doc(collection(db, 'users', userId, 'exercises'));
            const muscleGroupId = groupMap.get(exercise.muscleGroupName.toLowerCase()) || null;
            
            const secondaryMuscleGroupIds = (exercise.secondaryMuscleGroupNames || [])
                .map(name => groupMap.get(name.toLowerCase()))
                .filter(Boolean);

            const { muscleGroupName, secondaryMuscleGroupNames, ...restOfExercise } = exercise;
            
            batch.set(exerciseRef, { 
                ...restOfExercise, 
                muscleGroupId,
                secondaryMuscleGroupIds
            });
        });

        await batch.commit();
        console.log("Base de dados inicial criada para o novo usuário!");

    } catch (error) {
        console.error("Erro ao criar dados iniciais do usuário:", error);
    }
};

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginView, setIsLoginView] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(''); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            alert('Por favor, preencha o e-mail e a senha.');
            return;
        }

        setIsLoading(true);

        try {
            if (isLoginView) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                await createInitialUserData(user.uid);
            }
        } catch (err) {
            setError(getFriendlyErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        setError('');
        const userEmail = prompt("Por favor, insira o seu e-mail para recuperar a senha:");
        if (!userEmail) return;

        setIsLoading(true);
        try {
            await sendPasswordResetEmail(auth, userEmail);
            alert('Um e-mail para recuperação de senha foi enviado para o seu endereço.'); // Alert aqui é aceitável pois é uma confirmação positiva
        } catch (err) {
            setError(getFriendlyErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailChange = (e) => {
        if (error) setError('');
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        if (error) setError('');
        setPassword(e.target.value);
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
                    {error && (
                            <div className="bg-red-900/50 border border-red-700 text-red-300 text-sm rounded-lg p-3 flex items-center gap-3 animate-fade-in-fast">
                                <AlertTriangle size={20} />
                                <span>{error}</span>
                            </div>
                        )}

                    {/* Campos de E-mail e Senha */}
                    <InputField label="E-mail" type="email" value={email} onChange={handleEmailChange} placeholder="seu@email.com" />
                    <InputField label="Senha" type="password" value={password} onChange={handlePasswordChange} placeholder="Sua senha" />

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