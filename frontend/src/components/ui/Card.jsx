import React from 'react';

const Card = ({ className = '', children, style = {}, ...props }) => (
    <div
        style={{
            backgroundColor: '#d4d0c8',
            border: '2px solid',
            borderColor: '#ffffff #808080 #808080 #ffffff',
            boxShadow: '1px 1px 0 #000000, inset 1px 1px 0 #dfdfdf',
            borderRadius: 0,
            ...style,
        }}
        className={className}
        {...props}
    >
        {children}
    </div>
);

const CardHeader = ({ className = '', children, style = {}, ...props }) => (
    <div
        style={{
            background: 'linear-gradient(to right, #000080, #1084d0)',
            padding: '3px 6px',
            borderBottom: '1px solid #808080',
            ...style,
        }}
        className={className}
        {...props}
    >
        {children}
    </div>
);

const CardTitle = ({ className = '', children, style = {}, ...props }) => (
    <h3
        style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#ffffff',
            fontFamily: 'Tahoma, sans-serif',
            margin: 0,
            ...style,
        }}
        className={className}
        {...props}
    >
        {children}
    </h3>
);

const CardDescription = ({ className = '', children, style = {}, ...props }) => (
    <p
        style={{
            fontSize: '10px',
            color: '#c0c8e0',
            fontFamily: 'Tahoma, sans-serif',
            margin: 0,
            ...style,
        }}
        className={className}
        {...props}
    >
        {children}
    </p>
);

const CardContent = ({ className = '', children, style = {}, ...props }) => (
    <div
        style={{
            padding: '8px',
            fontFamily: 'Tahoma, sans-serif',
            ...style,
        }}
        className={className}
        {...props}
    >
        {children}
    </div>
);

const CardFooter = ({ className = '', children, style = {}, ...props }) => (
    <div
        style={{
            display: 'flex',
            alignItems: 'center',
            padding: '6px 8px',
            borderTop: '1px solid #808080',
            backgroundColor: '#c8c4bc',
            fontFamily: 'Tahoma, sans-serif',
            ...style,
        }}
        className={className}
        {...props}
    >
        {children}
    </div>
);

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
