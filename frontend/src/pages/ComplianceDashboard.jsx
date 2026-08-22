import { ClauseList } from '../components/ClauseList'
import { ComplianceReport } from '../components/ComplianceReport'
import { Downloads } from '../components/Downloads'
import { StatsGrid } from '../components/StatsGrid'

export function ComplianceDashboard({ run, clauses, clauseTotal, report, onLoadMore, isLoadingMore }) {
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-6 py-8 lg:px-8">
      <section className="rounded-2xl bg-brand-900 px-6 py-7 text-white shadow-lg md:px-8">
        <p className="text-sm font-medium text-brand-200">Analysis completed</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Compliance review for {run.uploaded_file}</h1>
        <p className="mt-3 text-sm text-brand-100">Run ID: <span className="font-mono">{run.run_id}</span></p>
      </section>
      <StatsGrid summary={run.summary} />
      <ClauseList clauses={clauses} total={clauseTotal} onLoadMore={onLoadMore} isLoadingMore={isLoadingMore} />
      <ComplianceReport report={report} />
      <Downloads artifacts={run.artifacts} />
    </main>
  )
}
