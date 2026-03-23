import React from 'react';

const PageHeader = ({ title, subtitle, breadcrumbs, actions, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {breadcrumbs && (
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          {breadcrumbs.map((crumb, i) => (
            <li key={i} className={`breadcrumb-item ${i === breadcrumbs.length - 1 ? 'active' : ''}`}>
              {crumb.link ? <a href={crumb.link}>{crumb.label}</a> : crumb.label}
            </li>
          ))}
        </ol>
      </nav>
    )}
    <div className="d-flex justify-content-between align-items-center">
      <div>
        <h2 className="mb-1">{title}</h2>
        {subtitle && <p className="text-muted mb-0">{subtitle}</p>}
      </div>
      {actions && <div className="d-flex gap-2">{actions}</div>}
    </div>
  </div>
);

export default PageHeader;
