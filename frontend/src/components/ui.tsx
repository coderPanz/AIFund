import { cn } from '../utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-950 focus:ring-accent-blue',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-gradient-to-r from-accent-blue to-accent-purple text-white hover:opacity-90 shadow-lg shadow-accent-blue/25': variant === 'primary',
          'bg-dark-800 text-dark-200 hover:bg-dark-700 hover:text-white border border-dark-700': variant === 'secondary',
          'border border-dark-600 text-dark-300 hover:bg-dark-800 hover:text-white': variant === 'outline',
          'text-dark-400 hover:bg-dark-800 hover:text-white': variant === 'ghost',
        },
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-sm': size === 'md',
          'px-6 py-3 text-base': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

interface CardProps {
  className?: string
  children: React.ReactNode
}

export function Card({ className, children }: CardProps) {
  return (
    <div className={cn('bg-dark-900/60 backdrop-blur-xl border border-dark-700/50 rounded-2xl', className)}>
      {children}
    </div>
  )
}

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  children: React.ReactNode
}

export function Badge({ variant = 'default', children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        {
          'bg-dark-800 text-dark-300': variant === 'default',
          'bg-accent-emerald/20 text-accent-emerald': variant === 'success',
          'bg-accent-amber/20 text-accent-amber': variant === 'warning',
          'bg-accent-rose/20 text-accent-rose': variant === 'danger',
          'bg-accent-blue/20 text-accent-blue': variant === 'info',
        }
      )}
    >
      {children}
    </span>
  )
}

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
}

export function Loading({ size = 'md' }: LoadingProps) {
  return (
    <div className="flex items-center justify-center">
      <div
        className={cn(
          'border-2 border-accent-blue border-t-transparent rounded-full animate-spin',
          {
            'w-4 h-4': size === 'sm',
            'w-6 h-6': size === 'md',
            'w-8 h-8': size === 'lg',
          }
        )}
      />
    </div>
  )
}