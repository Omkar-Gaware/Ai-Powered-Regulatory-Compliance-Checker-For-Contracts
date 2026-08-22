import { Header } from './components/Header'
import { UploadPanel } from './components/UploadPanel'
import { useAnalysis } from './hooks/useAnalysis'
import { ComplianceDashboard } from './pages/ComplianceDashboard'

function ErrorNotice({ message }) {
  return message ? <div className="mx-auto mt-6 max-w-7xl rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800">{message}</div> : null
}

export default function App() {
  const analysis = useAnalysis()
  return (
    <div id="top" className="min-h-screen bg-slate-100 text-slate-900">
      <Header hasRun={Boolean(analysis.run)} onNewAnalysis={analysis.reset} />
      <ErrorNotice message={analysis.error} />
      {analysis.run ? (
        <ComplianceDashboard
          run={analysis.run}
          clauses={analysis.clauses}
          clauseTotal={analysis.clauseTotal}
          report={analysis.report}
          onLoadMore={analysis.loadMore}
          isLoadingMore={analysis.isLoadingMore}
        />
      ) : (
        <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8"><UploadPanel onAnalyze={analysis.analyze} isProcessing={analysis.isProcessing} /></main>
      )}
    </div>
  )
}
