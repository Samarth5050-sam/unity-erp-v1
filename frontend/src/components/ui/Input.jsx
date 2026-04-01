import React, { forwardRef } from 'react';

const Input = forwardRef(({
    className = '',
    type,
    icon: Icon,
    error,
    label,
    ...props
}, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    type={type}
                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${Icon ? 'pl-10' : ''} ${error ? 'border-destructive focus-visible:ring-destructive' : ''} ${className}`}
                    ref={ref}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-sm font-medium text-destructive mt-1">{error}</p>
            )}
        </div>
    );
});

Input.displayName = "Input";

export default Input;
