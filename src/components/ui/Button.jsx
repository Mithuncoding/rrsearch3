export function Button({ children, variant = 'primary', size = 'md', className = '', disabled, as = 'button', ...props }) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg',
  };

  const Component = as;
  const baseClasses = `${variants[variant]} ${sizes[size]} ${className} inline-flex items-center justify-center`;

  return (
    <Component
      className={baseClasses}
      disabled={disabled}
      {...props}
    >
      {children}
    </Component>
  );
}
