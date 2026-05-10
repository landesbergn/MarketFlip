export function StaleBanner() {
  return (
    <div className="flex items-center gap-3 border border-[var(--oxblood)] bg-[rgba(139,31,31,0.06)] px-3 py-2">
      <span className="eyebrow text-[var(--oxblood)]">Late edition</span>
      <span className="figure text-xs text-[var(--ink-soft)]">
        showing recent results — wire is unreachable.
      </span>
    </div>
  );
}
