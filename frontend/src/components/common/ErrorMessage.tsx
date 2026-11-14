import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center p-4"
      style={{ minHeight: '200px', gap: '1rem' }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#fee2e2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AlertCircle size={28} color="#dc2626" />
      </div>

      <div>
        <p
          style={{
            color: 'var(--text-primary)',
            fontWeight: 600,
            fontSize: '1rem',
            marginBottom: '0.25rem',
          }}
        >
          Something went wrong
        </p>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            margin: 0,
            maxWidth: '400px',
          }}
        >
          {message}
        </p>
      </div>

      {onRetry && (
        <button className="btn btn-primary btn-sm" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
