import React from 'react';

const LoadingSpinner = ({ size = 'md', message = 'Chargement...' }) => {
  const sizeClasses = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border-lg',
  };

  return (
    <div className="d-flex justify-content-center align-items-center p-4">
      <div className={`spinner-border text-primary ${sizeClasses[size]}`} role="status">
        <span className="visually-hidden">{message}</span>
      </div>
      {message && <span className="ms-2">{message}</span>}
    </div>
  );
};

export default LoadingSpinner;
