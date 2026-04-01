import React, { forwardRef } from 'react';

const Input = forwardRef(({
    className = '',
    type,
    icon: Icon,
    error,
    label,
    style = {},
    ...props
}, ref) => {
    return (
        <div style={{ width: '100%' }}>
            {label && (
                <label style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#000000',
                    fontFamily: 'Tahoma, sans-serif',
                    marginBottom: '2px',
                }}>
                    {label}
                </label>
            )}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                {Icon && (
                    <div style={{
                        position: 'absolute', left: '4px',
                        display: 'flex', alignItems: 'center',
                        color: '#808080', pointerEvents: 'none',
                    }}>
                        <Icon size={12} />
                    </div>
                )}
                <input
                    type={type}
                    ref={ref}
                    style={{
                        width: '100%',
                        backgroundColor: '#ffffff',
                        border: '2px solid',
                        borderColor: '#808080 #ffffff #ffffff #808080',
                        boxShadow: 'inset 1px 1px 0 #404040',
                        padding: Icon ? '2px 4px 2px 20px' : '2px 4px',
                        fontFamily: 'Tahoma, MS Sans Serif, Arial, sans-serif',
                        fontSize: '11px',
                        color: '#000000',
                        outline: 'none',
                        height: '22px',
                        borderRadius: 0,
                        ...style,
                    }}
                    className={className}
                    onFocus={e => {
                        e.currentTarget.style.outline = '1px dotted #000000';
                        e.currentTarget.style.outlineOffset = '-3px';
                    }}
                    onBlur={e => {
                        e.currentTarget.style.outline = 'none';
                    }}
                    {...props}
                />
            </div>
            {error && (
                <p style={{ fontSize: '11px', color: '#cc0000', marginTop: '2px', fontFamily: 'Tahoma, sans-serif' }}>
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = "Input";

export default Input;
