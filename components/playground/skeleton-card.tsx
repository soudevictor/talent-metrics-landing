export function SkeletonCard() {
  return (
    <div
      aria-busy="true"
      aria-label="Carregando resultado da análise..."
      className="w-full rounded-2xl border border-border-subtle bg-surface p-6 sm:p-8 space-y-6 animate-pulse"
    >
      {/* Score skeleton — circular */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-center sm:text-left">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0">
          <div className="w-full h-full rounded-full bg-surface-elevated" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="h-10 w-10 rounded-full bg-surface-elevated mx-auto mb-1" />
            <div className="h-2 w-16 rounded bg-surface-elevated mx-auto" />
          </div>
        </div>
        <div className="flex-1 min-w-0 space-y-3">
          <div className="h-6 w-32 rounded bg-surface-elevated mx-auto sm:mx-0" />
          <div className="h-2 w-40 rounded-full bg-surface-elevated mx-auto sm:mx-0" />
        </div>
      </div>

      {/* Summary skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-32 rounded bg-surface-elevated" />
        <div className="h-4 w-full rounded bg-surface-elevated/70" />
        <div className="h-4 w-5/6 rounded bg-surface-elevated/60" />
        <div className="h-4 w-4/5 rounded bg-surface-elevated/50" />
      </div>

      {/* Points grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-canvas/40 border border-border-subtle space-y-3">
          <div className="h-4 w-24 rounded bg-surface-elevated" />
          <div className="h-4 w-full rounded bg-surface-elevated/70" />
          <div className="h-4 w-3/4 rounded bg-surface-elevated/60" />
          <div className="h-4 w-5/6 rounded bg-surface-elevated/50" />
        </div>
        <div className="p-4 rounded-xl bg-canvas/40 border border-border-subtle space-y-3">
          <div className="h-4 w-28 rounded bg-surface-elevated" />
          <div className="h-4 w-full rounded bg-surface-elevated/70" />
          <div className="h-4 w-2/3 rounded bg-surface-elevated/50" />
        </div>
      </div>
    </div>
  );
}