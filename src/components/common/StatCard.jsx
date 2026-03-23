import React from 'react';

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  variant = 'primary',
  className = ''
}) => {
  const trendColor = trend === 'up' ? 'text-success' : trend === 'down' ? 'text-danger' : 'text-muted';
  const trendIcon = trend === 'up' ? 'bi-arrow-up' : trend === 'down' ? 'bi-arrow-down' : '';

  return (
    <div className={`card border-0 shadow-sm ${className}`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <p className="text-muted mb-1 small">{title}</p>
            <h4 className={`mb-0 text-${variant}`}>{value}</h4>
            {subtitle && <small className="text-muted">{subtitle}</small>}
            {trendValue && (
              <div className={`small mt-1 ${trendColor}`}>
                {trendIcon && <i className={`bi ${trendIcon} me-1`}></i>}
                {trendValue}
              </div>
            )}
          </div>
          {icon && (
            <div className={`rounded-circle bg-${variant} bg-opacity-10 p-3`}>
              <i className={`bi ${icon} text-${variant} fs-4`}></i>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
