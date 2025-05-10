import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  // Base classes
  const baseClasses = 'font-medium transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-opacity-50 rounded-lg';
  
  // Size classes
  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
  };
  
  // Variant classes (light and dark mode aware)
  const variantClasses = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600',
    secondary: 'bg-teal-500 hover:bg-teal-600 text-white focus:ring-teal-400 dark:bg-teal-600 dark:hover:bg-teal-700',
    outline: 'border border-gray-300 hover:bg-gray-100 text-gray-700 focus:ring-gray-300 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-400 dark:bg-red-600 dark:hover:bg-red-700',
    ghost: 'hover:bg-gray-100 text-gray-700 focus:ring-gray-200 dark:text-gray-200 dark:hover:bg-gray-800',
  };
  
  // Width class
  const widthClass = fullWidth ? 'w-full' : '';
  
  // Disabled and loading states
  const disabledClass = (disabled || isLoading) ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer';
  
  // Combine classes
  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${widthClass}
    ${disabledClass}
    ${className}
  `;
  
  // Spacing for icons
  const leftIconSpacing = leftIcon ? 'mr-2' : '';
  const rightIconSpacing = rightIcon ? 'ml-2' : '';
  
  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : (
        <>
          {leftIcon && <span className={leftIconSpacing}>{leftIcon}</span>}
          {children}
          {rightIcon && <span className={rightIconSpacing}>{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;