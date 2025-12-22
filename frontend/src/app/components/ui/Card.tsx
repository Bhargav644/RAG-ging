import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'neon';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
}) => {
  const variants = {
    default: 'bg-midnight-900 border border-gray-800 rounded-3xl shadow-xl hover:border-gray-700 transition-colors',
    glass: 'glass-panel rounded-3xl hover:border-white/20 transition-colors',
    neon: 'bg-midnight-950 border border-aurora-purple/30 rounded-3xl shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all',
  };

  return (
    <div className={`p-8 ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <h3 className={`text-2xl font-bold bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent tracking-tight ${className}`}>
      {children}
    </h3>
  );
};

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`text-gray-300 ${className}`}>
      {children}
    </div>
  );
};
