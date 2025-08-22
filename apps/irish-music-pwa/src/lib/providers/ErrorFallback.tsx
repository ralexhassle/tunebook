interface ErrorFallbackProps {
  error?: Error;
  resetError: () => void;
}

export function DefaultErrorFallback({ resetError }: ErrorFallbackProps) {
  return (
    <div
      role="alert"
      style={{
        padding: '20px',
        border: '1px solid #f56565',
        borderRadius: '8px',
        backgroundColor: '#fed7d7',
        color: '#742a2a',
      }}
    >
      <h2>Quelque chose s'est mal passé</h2>
      <button
        onClick={resetError}
        style={{
          marginTop: '15px',
          padding: '8px 16px',
          backgroundColor: '#742a2a',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Réessayer
      </button>
    </div>
  );
}
