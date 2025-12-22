import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-300 mb-2 ml-1"
        >
          {label}
        </label>
      )}
      <div className="relative group">
        <div className={`absolute -inset-0.5 bg-gradient-to-r from-aurora-purple to-aurora-cyan rounded-xl opacity-0 group-focus-within:opacity-50 transition duration-500 blur-sm ${error ? 'from-aurora-red to-aurora-red opacity-100' : ''}`}></div>
        <input
          id={inputId}
          className={`relative w-full px-4 py-3 bg-midnight-950 border border-gray-800 text-gray-100 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent transition-all ${
            error ? 'border-aurora-red text-aurora-red' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-aurora-red font-medium flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-aurora-red" />
          {error}
        </p>
      )}
    </div>
  );
};
