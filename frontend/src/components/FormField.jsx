import React from 'react';

export const FormField = ({
  label,
  id,
  error,
  helperText,
  required = false,
  children
}) => {
  return (
    <div className="space-y-1.5 text-left w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700 select-none"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {helperText && !error && (
        <p className="text-xs text-slate-500">{helperText}</p>
      )}
      {error && (
        <p className="text-xs font-medium text-red-600 flex items-center gap-1 mt-1 animate-fadeIn">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};
