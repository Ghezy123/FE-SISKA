export const Card = ({ title, subtitle, children, className = '', headerAction }) => {
  return (
    <div className={`siska-card ${className}`}>
      {(title || headerAction) && (
        <div className="siska-card-header">
          <div>
            {title && <h3 className="siska-card-title">{title}</h3>}
            {subtitle && <p className="siska-card-subtitle">{subtitle}</p>}
          </div>
          {headerAction && <div className="siska-card-action">{headerAction}</div>}
        </div>
      )}
      <div className="siska-card-body">{children}</div>
    </div>
  );
};

