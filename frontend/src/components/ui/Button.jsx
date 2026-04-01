import React from 'react';

const Button = ({
    children,
    variant = 'default',
    size = 'default',
    className = '',
    isLoading = false,
    disabled,
    style = {},
    ...props
}) => {
    const baseStyle = {
        backgroundColor: '#d4d0c8',
        border: '2px solid',
        borderColor: '#ffffff #808080 #808080 #ffffff',
        boxShadow: 'inset 1px 1px 0 #dfdfdf',
        padding: '2px 10px',
        fontFamily: 'Tahoma, MS Sans Serif, Arial, sans-serif',
        fontSize: '11px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: '#000000',
        minHeight: '23px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        whiteSpace: 'nowrap',
        opacity: disabled ? 0.5 : 1,
        borderRadius: 0,
        ...style,
    };

    if (variant === 'ghost') {
        baseStyle.backgroundColor = 'transparent';
        baseStyle.border = 'none';
        baseStyle.boxShadow = 'none';
    }
    if (variant === 'destructive') {
        baseStyle.color = '#cc0000';
        baseStyle.borderColor = '#cc0000 #800000 #800000 #cc0000';
    }
    if (variant === 'outline') {
        baseStyle.backgroundColor = '#ffffff';
        baseStyle.borderColor = '#808080 #ffffff #ffffff #808080';
    }

    if (size === 'sm') {
        baseStyle.padding = '1px 6px';
        baseStyle.minHeight = '20px';
        baseStyle.fontSize = '10px';
    }
    if (size === 'lg') {
        baseStyle.padding = '4px 16px';
        baseStyle.minHeight = '28px';
        baseStyle.fontSize = '12px';
    }
    if (size === 'icon') {
        baseStyle.padding = '2px 4px';
        baseStyle.minHeight = '23px';
        baseStyle.minWidth = '23px';
    }

    return (
        <button
            style={baseStyle}
            disabled={disabled || isLoading}
            className={className}
            onMouseDown={e => {
                if (!disabled && !isLoading) {
                    e.currentTarget.style.borderColor = '#808080 #ffffff #ffffff #808080';
                    e.currentTarget.style.boxShadow = 'inset 1px 1px 0 #404040';
                    e.currentTarget.style.paddingLeft = variant === 'ghost' ? '' : '12px';
                    e.currentTarget.style.paddingTop = variant === 'ghost' ? '' : '3px';
                }
            }}
            onMouseUp={e => {
                if (!disabled && !isLoading) {
                    e.currentTarget.style.borderColor = '#ffffff #808080 #808080 #ffffff';
                    e.currentTarget.style.boxShadow = 'inset 1px 1px 0 #dfdfdf';
                    e.currentTarget.style.paddingLeft = '';
                    e.currentTarget.style.paddingTop = '';
                }
            }}
            {...props}
        >
            {isLoading && (
                <svg className="mr-1" style={{ width: 11, height: 11, animation: 'spin 1s linear infinite' }}
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {children}
        </button>
    );
};

export default Button;
