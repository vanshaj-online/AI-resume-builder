import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1 w-full">
                <label className="text-sm font-body font-medium text-ink">{label}</label>
                <input
                    ref={ref}
                    className={`bg-canvas-soft text-ink rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ink transition-shadow ${error ? 'border border-red-500' : 'border border-transparent'
                        } ${className}`}
                    {...props}
                />
                {error && <span className="text-sm text-red-500 mt-1">{error}</span>}
            </div>
        );
    }
);
Input.displayName = 'Input';