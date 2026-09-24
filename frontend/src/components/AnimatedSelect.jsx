import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export const AnimatedSelect = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  id,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => 
    typeof opt === 'object' ? opt.id === value || opt.label === value : opt === value
  );

  const displayLabel = selectedOption
    ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption)
    : value || placeholder;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (opt) => {
    const val = typeof opt === 'object' ? opt.id : opt;
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-11 px-3.5 rounded-xl border bg-white text-sm flex items-center justify-between transition-all duration-200 text-left ${
          isOpen
            ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs'
            : 'border-slate-300 hover:border-slate-400'
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={`truncate ${!value ? 'text-slate-400' : 'text-slate-900 font-medium'}`}>
          {displayLabel}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ml-2 ${
            isOpen ? 'rotate-180 text-indigo-600' : ''
          }`}
        />
      </button>

      {/* Animated Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute left-0 right-0 top-full mt-1.5 max-h-60 overflow-y-auto rounded-xl bg-white border border-slate-200/90 shadow-elevation z-50 py-1 animate-in fade-in zoom-in-95 duration-150"
          role="listbox"
        >
          {options.map((opt, idx) => {
            const optValue = typeof opt === 'object' ? opt.id : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            const isSelected = value === optValue;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(opt)}
                className={`w-full px-3.5 py-2.5 text-xs text-left flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-indigo-50 text-indigo-900 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
                role="option"
                aria-selected={isSelected}
              >
                <span>{optLabel}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
