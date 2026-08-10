import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'indigo' | 'emerald' | 'amber' | 'outline' | 'purple';
}

export function Badge({ className, variant = 'indigo', ...props }: BadgeProps) {
  const variants = {
    indigo: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    purple: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    outline: 'bg-transparent text-slate-300 border-slate-700',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm transition-colors',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
