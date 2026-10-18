import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'accent' | 'outline';
}

export function Badge({ className, variant = 'accent', ...props }: BadgeProps) {
  const variants = {
    accent: 'bg-accent-glow text-accent border-accent/30',
    outline: 'bg-transparent text-text-muted border-border-subtle',
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
