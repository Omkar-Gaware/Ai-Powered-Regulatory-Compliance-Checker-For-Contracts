const STATS = [
  ['Total clauses', 'total_clauses', 'border-slate-200 text-slate-900'],
  ['High risk', 'high_risk', 'border-rose-200 text-rose-700'],
  ['Medium risk', 'medium_risk', 'border-amber-200 text-amber-700'],
  ['Low risk', 'low_risk', 'border-emerald-200 text-emerald-700'],
  ['Open issues', 'total_issues', 'border-violet-200 text-violet-700'],
]

export function StatsGrid({ summary }) {
  return (
    <section aria-label="Analysis summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {STATS.map(([label, key, color]) => (
        <article key={key} className={`rounded-xl border bg-white p-5 shadow-sm ${color}`}>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{summary[key]}</p>
        </article>
      ))}
    </section>
  )
}
