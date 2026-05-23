import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'subtle';
    isLoading?: boolean;
}

export const Button = ({ children, variant = 'primary', isLoading, className = '', ...props }: ButtonProps) => {
    const baseStyles = 'inline-flex items-center justify-center font-body font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-primary text-on-primary rounded-pill px-4 py-3 hover:bg-black-elevated',
        secondary: 'bg-canvas text-ink border border-surface-pressed rounded-pill px-4 py-3 hover:bg-canvas-soft',
        subtle: 'bg-canvas-soft border border-surface-pressed text-ink rounded-pill px-4 py-2 text-sm hover:bg-surface-pressed',
    };

    return (
        <button className={`${baseStyles} ${variants[variant]} ${className}`} disabled={isLoading} {...props}>
            {isLoading ? <span className="animate-pulse">Loading...</span> : children}
        </button>
    );
};