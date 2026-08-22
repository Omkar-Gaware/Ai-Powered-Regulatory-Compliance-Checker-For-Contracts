import { useRef, useState } from 'react'

const MAX_FILE_SIZE = 25 * 1024 * 1024

function formatBytes(bytes) {
  if (!bytes) return '0 KB'
  return `${(bytes / (1024 * 1024)).toFixed(bytes < 1024 * 1024 ? 1 : 2)} MB`
}

export function UploadPanel({ onAnalyze, isProcessing }) {
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [validationMessage, setValidationMessage] = useState('')

  function selectFile(candidate) {
    setValidationMessage('')
    if (!candidate) return
    if (candidate.type !== 'application/pdf' && !candidate.name.toLowerCase().endsWith('.pdf')) {
      setFile(null)
      setValidationMessage('Only PDF contract files can be analyzed.')
      return
    }
    if (candidate.size > MAX_FILE_SIZE) {
      setFile(null)
      setValidationMessage('Choose a PDF smaller than 25 MB for this demonstration.')
      return
    }
    setFile(candidate)
  }

  function submit(event) {
    event.preventDefault()
    if (!file) {
      setValidationMessage('Select a PDF contract before starting the analysis.')
      return
    }
    onAnalyze(file)
  }

  return (
    <section className="panel overflow-hidden" aria-labelledby="upload-heading">
      <div className="grid gap-8 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-10">
        <div>
          <p className="eyebrow">Contract review workspace</p>
          <h1 id="upload-heading" className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
            Identify compliance gaps before they become exposure.
          </h1>
          <p className="mt-4 max-w-xl leading-7 text-slate-600">
            Upload a contract PDF to extract clauses, assess regulatory risk, generate amendment guidance, and prepare downloadable review artifacts.
          </p>
          <div className="mt-7 grid grid-cols-3 gap-3 text-center text-xs text-slate-600">
            <div className="rounded-lg bg-slate-50 p-3"><strong className="block text-base text-brand-900">GDPR</strong>data privacy</div>
            <div className="rounded-lg bg-slate-50 p-3"><strong className="block text-base text-brand-900">HIPAA</strong>health data</div>
            <div className="rounded-lg bg-slate-50 p-3"><strong className="block text-base text-brand-900">AI review</strong>clause-level</div>
          </div>
        </div>

        <form className="rounded-2xl border border-dashed border-brand-300 bg-brand-50/50 p-5" onSubmit={submit}>
          <label className="block cursor-pointer rounded-xl border border-brand-200 bg-white p-6 text-center transition hover:border-brand-500" htmlFor="contract-file">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-100 text-2xl text-brand-800">↑</span>
            <span className="mt-3 block font-semibold text-slate-800">Select a contract PDF</span>
            <span className="mt-1 block text-sm text-slate-500">PDF only · up to 25 MB</span>
          </label>
          <input
            ref={inputRef}
            id="contract-file"
            className="sr-only"
            type="file"
            accept="application/pdf,.pdf"
            onChange={(event) => selectFile(event.target.files?.[0])}
          />

          {file && (
            <div className="mt-4 flex items-center justify-between rounded-lg bg-white px-4 py-3 text-sm shadow-sm">
              <span className="min-w-0 truncate font-medium text-slate-700">{file.name}</span>
              <span className="ml-3 shrink-0 text-slate-500">{formatBytes(file.size)}</span>
            </div>
          )}
          {validationMessage && <p className="mt-3 text-sm font-medium text-rose-700">{validationMessage}</p>}

          <button className="button-primary mt-5 w-full" type="submit" disabled={isProcessing}>
            {isProcessing ? 'Analyzing contract…' : 'Upload contract & analyze'}
          </button>
          {isProcessing && <p className="mt-3 text-center text-sm text-brand-800">Extraction, risk analysis, and report generation are in progress.</p>}
        </form>
      </div>
    </section>
  )
}
