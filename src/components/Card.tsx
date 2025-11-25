import React from 'react'
import { cn } from '../utils/classNames'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1', className)}
    {...props}
  />
))

Card.displayName = 'Card'

export { Card }
