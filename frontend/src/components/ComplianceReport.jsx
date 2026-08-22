export function ComplianceReport({ report }) {
  const compliance = report?.compliance_report || {}
  const issues = Array.isArray(compliance.issues) ? compliance.issues : []
  const amended = Array.isArray(report?.amended_clauses) ? report.amended_clauses : []

  return (
    <section className="panel p-6 md:p-8" aria-labelledby="report-heading">
      <p className="eyebrow">Compliance report</p>
      <h2 id="report-heading" className="mt-2 text-2xl font-semibold text-slate-950">Findings and amendment activity</h2>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-5">
          <h3 className="font-semibold text-slate-800">Detected issues</h3>
          {issues.length ? (
            <ul className="mt-3 space-y-3">
              {issues.map((issue, index) => (
                <li key={`${issue.clause_id || 'issue'}-${index}`} className="rounded-lg border border-slate-200 bg-white p-3">
                  <div className="flex items-center justify-between gap-2"><span className="font-medium text-slate-800">Clause {issue.clause_id || '—'}</span><span className="text-xs font-bold uppercase text-rose-700">{issue.severity || 'review'}</span></div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{issue.explanation || issue.issue_type || 'Compliance review required.'}</p>
                </li>
              ))}
            </ul>
          ) : <p className="mt-3 text-sm text-slate-500">No reportable compliance issues were detected.</p>}
        </div>
        <div className="rounded-xl bg-brand-50 p-5">
          <h3 className="font-semibold text-brand-950">Amended high-risk clauses</h3>
          {amended.length ? (
            <div className="mt-3 flex flex-wrap gap-2">{amended.map((id) => <span key={id} className="rounded-full bg-white px-3 py-1 text-sm font-medium text-brand-800 shadow-sm">Clause {id}</span>)}</div>
          ) : <p className="mt-3 text-sm text-slate-600">No clause amendments were required for this run.</p>}
        </div>
      </div>
    </section>
  )
}
