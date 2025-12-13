import React from 'react';

/**
 * Reusable Card component with variants and spacing options
 * Provides consistent styling throughout the application
 */

// Main Card component
export function Card({ 
  children, 
  variant = 'default', 
  spacing = 'comfortable',
  className = '',
  onClick,
  ...props 
}) {
  const variantStyles = {
    default: 'bg-white/5 border-interactive hover:border-emphasis',
    elevated: 'bg-white/5 border-interactive hover:border-emphasis shadow-lg hover:shadow-xl',
    ghost: 'bg-transparent border-subtle hover:border-interactive',
    accent: 'bg-purple-500/10 border-accent hover:border-purple-300'
  };

  const spacingStyles = {
    compact: 'p-3',
    comfortable: 'p-5',
    spacious: 'p-6'
  };

  const baseStyles = 'border rounded-xl transition-all duration-200';
  const interactiveStyles = onClick ? 'cursor-pointer hover:-translate-y-0.5' : '';

  return (
    <div
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${spacingStyles[spacing]}
        ${interactiveStyles}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

// Card Header component
export function CardHeader({ 
  title, 
  subtitle,
  icon: Icon, 
  badge,
  action,
  className = '' 
}) {
  return (
    <div className={`flex items-start justify-between mb-4 ${className}`}>
      <div className="flex items-start gap-3 flex-1">
        {Icon && (
          <div className="p-2 bg-purple-500/20 rounded-lg flex-shrink-0">
            {typeof Icon === 'function' ? <Icon className="w-5 h-5 text-purple-400" /> : Icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-white">
              {title}
            </h3>
            {badge && (
              <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full bg-purple-500/20 border border-purple-400 text-purple-200">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-neutral-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && (
        <div className="ml-3 flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}

// Card Content component
export function CardContent({ children, className = '' }) {
  return (
    <div className={`text-sm text-neutral-300 ${className}`}>
      {children}
    </div>
  );
}

// Card Footer component
export function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-4 pt-4 border-t border-subtle flex items-center gap-3 ${className}`}>
      {children}
    </div>
  );
}

// Card Grid for layouts
export function CardGrid({ children, columns = 3, className = '' }) {
  const columnStyles = {
    1: 'grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid ${columnStyles[columns]} gap-4 ${className}`}>
      {children}
    </div>
  );
}

export default Card;
