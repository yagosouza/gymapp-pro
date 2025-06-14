import React from 'react';

export const GlobalStyles = () => (<style>{`
    body { 
        background-color: #111827; /* Cor de fundo do nosso tema (bg-gray-900) */
    }
    .btn-primary { @apply flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow disabled:opacity-50 disabled:cursor-not-allowed; } 
    .btn-secondary { @apply flex items-center justify-center gap-2 bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors shadow; } 
    .btn-icon { @apply p-2 rounded-full hover:bg-gray-700 transition-colors; } 
    .input-base { @apply w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-white; } 
    @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } 
    .animate-fade-in { animation: fade-in 0.5s ease-out forwards; } 
    @keyframes fade-in-fast { from { opacity: 0; } to { opacity: 1; } } 
    .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out forwards; }
`}</style>);