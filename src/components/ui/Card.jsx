export function Card({ title, description, children, className = "" }) {
  return (
    <section
      className={`rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm ${className}`}
    >
      {title ? <h2 className="text-lg font-semibold">{title}</h2> : null}
      {description ? (
        <p className="mt-1 text-sm text-[var(--muted)]">{description}</p>
      ) : null}
      <div className={title || description ? "mt-4" : ""}>{children}</div>
    </section>
  );
}
