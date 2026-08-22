const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

// The proxy avoids changing the existing backend's deliberately absent CORS policy.
export const API_BASE_URL = configuredBaseUrl || '/api-backend'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function buildUrl(path) {
  return `${API_BASE_URL.replace(/\/$/, '')}${path}`
}

async function request(path, options = {}) {
  let response
  try {
    response = await fetch(buildUrl(path), options)
  } catch {
    throw new ApiError('Unable to reach the compliance service. Check that the API is running.', 0)
  }

  if (!response.ok) {
    if (response.status === 400) {
      throw new ApiError('Please choose a valid PDF contract and try again.', response.status)
    }
    if (response.status === 404) {
      throw new ApiError('The requested analysis result is no longer available.', response.status)
    }
    throw new ApiError('Analysis could not be completed. Please try again shortly.', response.status)
  }

  return response
}

export const api = {
  async analyzeContract(file) {
    const formData = new FormData()
    formData.append('file', file)
    const response = await request('/api/v1/contracts/analyze', { method: 'POST', body: formData })
    return response.json()
  },

  async getRun(runId) {
    const response = await request(`/api/v1/runs/${encodeURIComponent(runId)}`)
    return response.json()
  },

  async getClauses(runId, offset = 0, limit = 50) {
    const response = await request(
      `/api/v1/runs/${encodeURIComponent(runId)}/clauses?offset=${offset}&limit=${limit}`,
    )
    return response.json()
  },

  async getReport(runId) {
    const response = await request(`/api/v1/runs/${encodeURIComponent(runId)}/report`)
    return response.json()
  },

  artifactUrl(downloadPath) {
    return buildUrl(downloadPath)
  },
}
