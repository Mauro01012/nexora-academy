export function ProgressBar({ value, label, complete = false }: { value: number; label: string; complete?: boolean }) {
  return (
    <div className="progress" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
      <span className={`progress__fill ${complete ? 'progress__fill--done' : ''}`.trim()} style={{ width: `${value}%` }} />
    </div>
  );
}
