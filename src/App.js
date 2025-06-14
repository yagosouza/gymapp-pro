import React, { useState } from 'react';
import { LoginPage } from './pages/auth/LoginPage';
import GymApp from './components/GymApp';
import { AppProvider } from './context/AppContext';

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    const handleLogin = (username, password) => {
        if ((username === 'admin' && password === 'admin') || (username === '' && password === '')) {
            setIsLoggedIn(true);
        } else {
            alert('Utilizador ou senha inválidos');
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false); 
    };

    if (!isLoggedIn) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <AppProvider>
            <GymApp onLogout={handleLogout} />
         </AppProvider>
    );
}
