interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullPage?: boolean;
}

const sizeMap = {
  sm: 'spinner-border-sm',
  md: '',
  lg: 'spinner-border-lg',
};

const LoadingSpinner = ({ size = 'md', text, fullPage = false }: LoadingSpinnerProps) => {
  const spinnerClass = `spinner-border spinner-primary ${sizeMap[size]}`;

  const content = (
    <div className="d-flex flex-column align-items-center gap-3">
      <div className={spinnerClass} role="status" aria-label="Loading">
        <span className="visually-hidden">Loading...</span>
      </div>
      {text && (
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: size === 'sm' ? '0.8rem' : '0.95rem',
            fontWeight: 500,
            margin: 0,
          }}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
