import { clsx } from 'clsx';

const variants = {
  primary: 'bg-uber-black text-white hover:bg-gray-800 active:bg-gray-900',
  secondary: 'bg-uber-light-gray text-uber-text hover:bg-uber-gray active:bg-gray-300',
  outline: 'border-2 border-uber-black text-uber-black hover:bg-uber-light-gray',
  ghost: 'text-uber-black hover:bg-uber-light-gray',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
};


const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  full: 'w-full px-6 py-3 text-base',
};


export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        // Base styles
        'rounded-uber font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-uber-black',
        'active:scale-95',
        
        // Variant styles
        variants[variant],
        
        // Size styles
        sizes[size],
        
        // Disabled state
        (disabled || loading) && 'opacity-50 cursor-not-allowed active:scale-100',
        
        // Custom className
        className
      )}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};


export const IconButton = ({
  children,
  onClick,
  className = '',
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'p-2 rounded-full transition-colors',
        'hover:bg-uber-light-gray active:bg-uber-gray',
        'focus:outline-none focus:ring-2 focus:ring-uber-black',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
