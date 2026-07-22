import type { ReactNode } from 'react'

/** Consistent titled container for admin charts and widgets. */
export default function Panel({
  title,
  subtitle,
  action,
  children,
  className = '',
}: {
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`glass-strong flex flex-col p-5 sm:p-6 ${className}`}>
      <header className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-white">{title}</h3>
          {subtitle && <p className="mt-0.5 text-sm text-slate-400">{subtitle}</p>}
        </div>
        {action}
      </header>
      <div className="flex-1">{children}</div>
    </section>
  )
}
