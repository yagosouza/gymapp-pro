import React, { useState, useEffect } from 'react';
import { LoginPage } from './pages/auth/LoginPage';
import GymApp from './components/GymApp';
import { AppProvider } from './context/AppContext';
import { auth } from './firebase/config'; // Importe o auth
import { onAuthStateChanged } from "firebase/auth";

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Ouve as mudanças de estado de autenticação
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        // Limpa o listener ao desmontar
        return () => unsubscribe();
    }, []);

    if (loading) {
        // Pode adicionar um componente de loading aqui
        return <div>A carregar...</div>;
    }

    if (!user) {
        return <LoginPage />;
    }

    // Passamos o UID do utilizador para o AppProvider
    return (
        <AppProvider userId={user.uid}>
            <GymApp />
        </AppProvider>
    );
}