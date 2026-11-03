export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  className = '',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`siska-btn siska-btn-${variant} siska-btn-${size} ${className}`}
    >
      {children}
    </button>
  );
};

