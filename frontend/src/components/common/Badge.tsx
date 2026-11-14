import React from 'react';

interface BadgeProps {
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
  size?: 'sm' | 'md';
}

const variantStyles: Record<BadgeProps['variant'], React.CSSProperties> = {
  primary: {
    background: 'var(--primary-light)',
    color: 'var(--primary)',
    border: '1px solid #bfdbfe',
  },
  secondary: {
    background: '#f1f5f9',
    color: '#475569',
    border: '1px solid #e2e8f0',
  },
  success: {
    background: '#dcfce7',
    color: '#166534',
    border: '1px solid #bbf7d0',
  },
  warning: {
    background: '#fef3c7',
    color: '#92400e',
    border: '1px solid #fde68a',
  },
  danger: {
    background: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #fecaca',
  },
  info: {
    background: '#e0f2fe',
    color: '#075985',
    border: '1px solid #bae6fd',
  },
};

const Badge = ({ variant, children, size = 'md' }: BadgeProps) => {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    letterSpacing: '0.01em',
    borderRadius: '50px',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    padding: size === 'sm' ? '0.2em 0.55em' : '0.3em 0.75em',
    fontSize: size === 'sm' ? '0.7rem' : '0.8rem',
    ...variantStyles[variant],
  };

  return <span style={baseStyle}>{children}</span>;
};

export default Badge;
