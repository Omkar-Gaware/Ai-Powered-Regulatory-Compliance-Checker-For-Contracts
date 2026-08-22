import { useCallback, useState } from 'react'

import { api } from '../services/api'

export function useAnalysis() {
  const [run, setRun] = useState(null)
  const [clauses, setClauses] = useState([])
  const [clauseTotal, setClauseTotal] = useState(0)
  const [report, setReport] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState('')

  const loadResults = useCallback(async (runId) => {
    const [runDetail, firstClausePage, reportResponse] = await Promise.all([
      api.getRun(runId),
      api.getClauses(runId),
      api.getReport(runId),
    ])
    setRun(runDetail)
    setClauses(firstClausePage.items)
    setClauseTotal(firstClausePage.total)
    setReport(reportResponse.report)
  }, [])

  const analyze = useCallback(async (file) => {
    setError('')
    setIsProcessing(true)
    try {
      const analysis = await api.analyzeContract(file)
      await loadResults(analysis.run_id)
    } catch (requestError) {
      setError(requestError.message || 'Unable to analyze this contract.')
    } finally {
      setIsProcessing(false)
    }
  }, [loadResults])

  const loadMore = useCallback(async () => {
    if (!run || clauses.length >= clauseTotal) return
    setError('')
    setIsLoadingMore(true)
    try {
      const page = await api.getClauses(run.run_id, clauses.length)
      setClauses((current) => [...current, ...page.items])
      setClauseTotal(page.total)
    } catch (requestError) {
      setError(requestError.message || 'Unable to load more clauses.')
    } finally {
      setIsLoadingMore(false)
    }
  }, [clauses.length, clauseTotal, run])

  const reset = useCallback(() => {
    setRun(null)
    setClauses([])
    setClauseTotal(0)
    setReport(null)
    setError('')
  }, [])

  return {
    run,
    clauses,
    clauseTotal,
    report,
    isProcessing,
    isLoadingMore,
    error,
    analyze,
    loadMore,
    reset,
  }
}
