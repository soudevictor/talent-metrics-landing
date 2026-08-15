import { cn } from '@/lib/utils';

export function SkeletonCard() {
  return (
    <div
      aria-busy="true"
      aria-label="Carregando resultado da análise..."
      className="w-full rounded-2xl border border-border-subtle bg-surface p-5 sm:p-6 backdrop-blur-xl space-y-6 animate-pulse"
    >
      {/* Score skeleton */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-surface-elevated" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 rounded bg-surface-elevated" />
          <div className="h-3 w-48 rounded bg-surface-elevated/80" />
        </div>
      </div>

      {/* Summary skeleton */}
      <div className="space-y-2">
        <div className="h-3 w-24 rounded bg-surface-elevated" />
        <div className="h-3 w-full rounded bg-surface-elevated/70" />
        <div className="h-3 w-4/5 rounded bg-surface-elevated/60" />
      </div>

      {/* Points grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 p-4 rounded-xl bg-canvas/40 border border-border-subtle">
          <div className="h-3 w-28 rounded bg-surface-elevated" />
          <div className="h-3 w-full rounded bg-surface-elevated/60" />
          <div className="h-3 w-3/4 rounded bg-surface-elevated/50" />
          <div className="h-3 w-5/6 rounded bg-surface-elevated/40" />
        </div>
        <div className="space-y-2 p-4 rounded-xl bg-canvas/40 border border-border-subtle">
          <div className="h-3 w-36 rounded bg-surface-elevated" />
          <div className="h-3 w-full rounded bg-surface-elevated/60" />
          <div className="h-3 w-2/3 rounded bg-surface-elevated/50" />
        </div>
      </div>
    </div>
  );
}
