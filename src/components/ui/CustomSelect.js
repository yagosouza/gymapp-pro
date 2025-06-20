import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export function CustomSelect({ options, value, onChange, placeholder = "Selecione..." }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    const selectedOption = options.find(opt => opt.id === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ref]);

    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={ref}>
            <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left text-gray-200 p-2 bg-gray-700/50 rounded-lg hover:bg-gray-700">
                <span className={selectedOption ? 'text-white' : 'text-gray-400'}>{selectedOption ? selectedOption.name : placeholder}</span>
                <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isOpen && (
                <div className="absolute z-20 top-full mt-1 w-full bg-gray-800 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto animate-fade-in-fast p-1">
                    {options.map(opt => (
                        <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleSelect(opt.id)}
                            className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-md text-white hover:bg-blue-600 transition-colors ${opt.id === value ? 'bg-blue-600' : ''}`}
                        >
                            <span>{opt.name}</span>
                            {opt.id === value && <Check size={16} />}
                        </button>
                    ))}
                    {options.length === 0 && (
                        <p className="text-center text-gray-500 py-2">Nenhuma opção disponível.</p>
                    )}
                </div>
            )}
        </div>
    );
}
