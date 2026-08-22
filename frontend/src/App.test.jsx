import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { apiMock } = vi.hoisted(() => ({
  apiMock: {
    analyzeContract: vi.fn(),
    getRun: vi.fn(),
    getClauses: vi.fn(),
    getReport: vi.fn(),
    artifactUrl: vi.fn((path) => `/api-backend${path}`),
  },
}))

vi.mock('./services/api', () => ({ api: apiMock }))

import App from './App'

const runId = '1234567890abcdef1234567890abcdef'
const clauses = [{
  clause_id: '1',
  clause_heading: 'Data Protection',
  clause_type: 'Data Protection',
  clause_text: 'The processor shall protect personal data.',
  risk: { severity: 'high', risk_score: 91 },
}]

function setSuccessfulResponses() {
  apiMock.analyzeContract.mockResolvedValue({ run_id: runId })
  apiMock.getRun.mockResolvedValue({
    run_id: runId,
    uploaded_file: 'sample.pdf',
    summary: { total_clauses: 1, high_risk: 1, medium_risk: 0, low_risk: 0, total_issues: 1 },
    artifacts: ['clauses_json', 'annotations_csv', 'compliance_report', 'updated_contract_txt', 'updated_contract_pdf'].map((type) => ({ type, filename: `${type}.txt`, download_url: `/artifact/${type}` })),
  })
  apiMock.getClauses.mockResolvedValue({ total: 1, items: clauses })
  apiMock.getReport.mockResolvedValue({ report: { compliance_report: { issues: [{ clause_id: '1', severity: 'high', explanation: 'Missing safeguards.' }] }, amended_clauses: ['1'] } })
}

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows analysis results from mocked API responses', async () => {
    setSuccessfulResponses()
    render(<App />)
    const input = screen.getByLabelText(/select a contract pdf/i)
    fireEvent.change(input, { target: { files: [new File(['pdf'], 'sample.pdf', { type: 'application/pdf' })] } })
    fireEvent.click(screen.getByRole('button', { name: /upload contract & analyze/i }))

    expect(await screen.findByText(/compliance review for sample.pdf/i)).toBeTruthy()
    expect(screen.getAllByText('Data Protection')).toHaveLength(2)
    expect(screen.getByText(/detected issues/i)).toBeTruthy()
    expect(screen.getByText(/updated contract pdf/i)).toBeTruthy()
  })

  it('shows a useful error if analysis fails', async () => {
    apiMock.analyzeContract.mockRejectedValue(new Error('Unable to reach the compliance service. Check that the API is running.'))
    render(<App />)
    fireEvent.change(screen.getByLabelText(/select a contract pdf/i), { target: { files: [new File(['pdf'], 'sample.pdf', { type: 'application/pdf' })] } })
    fireEvent.click(screen.getByRole('button', { name: /upload contract & analyze/i }))
    await waitFor(() => expect(screen.getByText(/unable to reach the compliance service/i)).toBeTruthy())
  })
})
