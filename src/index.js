import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from './components/ui/Toast';
import { AppErrorBoundary } from './components/ErrorBoundary';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AppErrorBoundary>
        <BrowserRouter>
            <ToastProvider>
                <React.StrictMode>
                    <App />
                </React.StrictMode>
                <ToastContainer />
            </ToastProvider>
        </BrowserRouter>
    </AppErrorBoundary>
);

serviceWorkerRegistration.register();

reportWebVitals();
