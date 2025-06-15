import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

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
            <button type="button" onClick={() => setIsOpen(!isOpen)} className="input-base w-full flex justify-between items-center text-left bg-gray-600 hover:bg-gray-500 transition-colors">
                <span className={selectedOption ? 'text-white' : 'text-gray-400'}>{selectedOption ? selectedOption.name : placeholder}</span>
                <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute z-20 top-full mt-1 w-full bg-gray-800 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {options.map(opt => (<button key={opt.id} type="button" onClick={() => handleSelect(opt.id)} className="block w-full text-left px-4 py-2 text-white hover:bg-blue-600">{opt.name}</button>))}
                </div>
            )}
        </div>
    );
}
