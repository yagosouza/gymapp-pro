import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import GymApp from './components/GymApp';
import { AppProvider } from './context/AppContext';
import { auth } from './firebase/config';
import { onAuthStateChanged } from "firebase/auth";
import { LoadingOverlay } from './components/ui/LoadingOverlay';

function ProtectedRoute({ user, children }) {
    if (!user) return <Navigate to="/login" replace />;
    return children;
}

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <LoadingOverlay isActive={true} message="A verificar sessão..." />;
    }

    return (
        <Routes>
            <Route
                path="/login"
                element={!user ? <LoginPage /> : <Navigate to="/" replace />}
            />
            <Route
                path="/*"
                element={
                    <ProtectedRoute user={user}>
                        <AppProvider userId={user.uid}>
                            <GymApp />
                        </AppProvider>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}
