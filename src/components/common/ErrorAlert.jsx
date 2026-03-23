import React from 'react';

const ErrorAlert = ({ message = 'Une erreur est survenue', onRetry, variant = 'danger' }) => (
  <div className={`alert alert-${variant} d-flex align-items-center`} role="alert">
    <i className="bi bi-exclamation-triangle-fill me-2"></i>
    <div className="flex-grow-1">{message}</div>
    {onRetry && (
      <button className="btn btn-outline-danger btn-sm ms-2" onClick={onRetry}>
        Réessayer
      </button>
    )}
  </div>
);

export default ErrorAlert;
