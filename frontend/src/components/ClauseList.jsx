function riskLevel(clause) {
  const level = clause?.risk?.severity || clause?.risk?.risk_level || 'unknown'
  return String(level).toLowerCase()
}

const BADGE_STYLES = {
  high: 'bg-rose-100 text-rose-800 ring-rose-200',
  critical: 'bg-rose-100 text-rose-800 ring-rose-200',
  medium: 'bg-amber-100 text-amber-800 ring-amber-200',
  low: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  unknown: 'bg-slate-100 text-slate-700 ring-slate-200',
}

export function ClauseList({ clauses, total, onLoadMore, isLoadingMore }) {
  if (!clauses.length) {
    return <section className="panel p-8 text-center text-slate-500">No clauses were returned for this contract.</section>
  }

  return (
    <section className="panel p-6 md:p-8" aria-labelledby="clauses-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Clause analysis</p>
          <h2 id="clauses-heading" className="mt-2 text-2xl font-semibold text-slate-950">Clause-level risk assessment</h2>
        </div>
        <p className="text-sm text-slate-500">Showing {clauses.length} of {total} clauses</p>
      </div>
      <div className="mt-5 space-y-3">
        {clauses.map((clause, index) => {
          const level = riskLevel(clause)
          return (
            <details key={`${clause.clause_id ?? 'clause'}-${index}`} className="group rounded-xl border border-slate-200 bg-white p-4 open:border-brand-300 open:shadow-sm">
              <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3">
                <span className="grid h-8 min-w-8 place-items-center rounded-lg bg-brand-50 px-2 text-sm font-bold text-brand-800">{clause.clause_id ?? '—'}</span>
                <span className="min-w-40 flex-1 font-semibold text-slate-800">{clause.clause_heading || clause.clause_type || 'Contract clause'}</span>
                {clause.clause_type && <span className="text-sm text-slate-500">{clause.clause_type}</span>}
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase ring-1 ${BADGE_STYLES[level] || BADGE_STYLES.unknown}`}>{level}</span>
                <span className="text-slate-400 transition group-open:rotate-180">⌄</span>
              </summary>
              <div className="mt-4 border-t border-slate-100 pt-4">
                <p className="whitespace-pre-wrap leading-7 text-slate-700">{clause.clause_text || 'Clause text was not provided.'}</p>
                {clause.risk && (
                  <div className="mt-4 rounded-lg bg-slate-950 p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Original risk analysis</p>
                    <pre className="overflow-x-auto whitespace-pre-wrap break-words text-xs leading-5 text-slate-100">{JSON.stringify(clause.risk, null, 2)}</pre>
                  </div>
                )}
              </div>
            </details>
          )
        })}
      </div>
      {clauses.length < total && (
        <button className="button-secondary mx-auto mt-6" type="button" onClick={onLoadMore} disabled={isLoadingMore}>
          {isLoadingMore ? 'Loading clauses…' : 'Load more clauses'}
        </button>
      )}
    </section>
  )
}
