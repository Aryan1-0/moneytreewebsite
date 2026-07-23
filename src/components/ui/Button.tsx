import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-moss-400/60 disabled:opacity-50 disabled:pointer-events-none'

const variants: Record<Variant, string> = {
  primary:
    'bg-moss-400 text-night-950 hover:bg-moss-300 shadow-lg shadow-moss-400/25 hover:shadow-glow/40 hover:-translate-y-0.5',
  ghost: 'text-slate-200 hover:text-white hover:bg-white/5',
  outline:
    'border border-white/15 text-slate-100 hover:border-moss-400/50 hover:bg-moss-400/5 hover:text-white',
}

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = 'primary', size = 'md', className = '', children, ...rest }, ref) => (
    <button
      ref={ref}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  ),
)
Button.displayName = 'Button'
export default Button
