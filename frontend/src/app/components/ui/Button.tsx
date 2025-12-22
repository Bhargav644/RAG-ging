import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled,
  ...props
}) => {
  const baseStyles = 'relative inline-flex items-center justify-center font-bold uppercase tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed border-[2px] border-black active:translate-y-[1px] active:translate-x-[1px] active:shadow-none font-syne text-sm';

  const variants = {
    primary: 'bg-black text-white hover:bg-gray-900 brutalist-shadow-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
    secondary: 'bg-white text-black hover:bg-gray-50 brutalist-shadow-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
    ghost: 'bg-transparent border-transparent text-black hover:bg-gray-100/50 hover:border-transparent hover:underline decoration-2 underline-offset-4 shadow-none active:translate-y-0 active:translate-x-0',
    glass: 'bg-white/90 text-black backdrop-blur-sm hover:bg-white brutalist-shadow-sm border-[2px] border-black',
  };

  const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-6 text-base',
    lg: 'h-14 px-8 text-lg',
  };

  const buttonClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
      )}
    </button>
  );
};
