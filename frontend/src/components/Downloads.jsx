import { ARTIFACT_LABELS, ARTIFACT_ORDER } from '../types/api'
import { api } from '../services/api'

export function Downloads({ artifacts }) {
  const available = new Map(artifacts.map((artifact) => [artifact.type, artifact]))
  return (
    <section className="panel p-6 md:p-8" aria-labelledby="downloads-heading">
      <p className="eyebrow">Review artifacts</p>
      <h2 id="downloads-heading" className="mt-2 text-2xl font-semibold text-slate-950">Download analysis outputs</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ARTIFACT_ORDER.map((type) => {
          const artifact = available.get(type)
          return artifact ? (
            <a key={type} className="download-card" href={api.artifactUrl(artifact.download_url)}>
              <span className="font-semibold text-slate-800">{ARTIFACT_LABELS[type]}</span>
              <span className="mt-1 block truncate text-xs text-slate-500">{artifact.filename}</span>
              <span className="mt-3 inline-block text-sm font-semibold text-brand-700">Download →</span>
            </a>
          ) : null
        })}
      </div>
    </section>
  )
}
