export function Header({ hasRun, onNewAnalysis }) {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <a className="flex items-center gap-3" href="#top" aria-label="Compliance Checker home">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-800 text-lg font-bold text-white">§</span>
          <span>
            <span className="block text-sm font-semibold tracking-wide text-brand-900">LEXGUARD</span>
            <span className="block text-xs text-slate-500">Contract Compliance Intelligence</span>
          </span>
        </a>
        {hasRun && (
          <button className="button-secondary" type="button" onClick={onNewAnalysis}>
            Analyze another contract
          </button>
        )}
      </div>
    </header>
  )
}
