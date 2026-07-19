const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    const errorPayload = await response.text();
    throw new Error(errorPayload || `Request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getBackendMetrics() {
  return requestJson<any>('/api/v1/evaluation/metrics');
}

export async function getRunHistory() {
  return requestJson<any>('/api/v1/run-history');
}

export async function getBenchmark() {
  return requestJson<any>('/api/v1/benchmark');
}

export async function getRetrievalAnalytics() {
  return requestJson<any>('/api/v1/retrieval');
}

export async function getMemo() {
  return requestJson<any>('/api/v1/memo?opportunity_id=infraai');
}

export async function uploadPitchDeck(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/v1/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorPayload = await response.text();
    throw new Error(errorPayload || `Upload failed with ${response.status}`);
  }

  return response.json();
}

export async function runDiligence(opportunityId: string) {
  const params = new URLSearchParams({ opportunity_id: opportunityId });
  return requestJson<any>(`/api/v1/diligence/run?${params.toString()}`, { method: 'POST' });
}

// ============================================================================
// INBOUND APPLICATION ENDPOINTS
// ============================================================================

export async function submitInboundApplication(formData: any) {
  return requestJson<any>('/api/v1/inbound/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
}

export async function startEnrichment(opportunityId: string) {
  return requestJson<any>(`/api/v1/inbound/enrich?opportunity_id=${opportunityId}`, {
    method: 'POST',
  });
}

export async function getEnrichmentStatus(opportunityId: string) {
  return requestJson<any>(`/api/v1/inbound/enrichment-status/${opportunityId}`);
}

// ============================================================================
// OUTBOUND DISCOVERY ENDPOINTS
// ============================================================================

export async function executeDiscoverySearch(query: string, sources: any, filters: any) {
  return requestJson<any>('/api/v1/outbound/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, sources, filters }),
  });
}

export async function createInvestmentCase(candidateData: any) {
  return requestJson<any>('/api/v1/outbound/create-case', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(candidateData),
  });
}

export async function saveDiscoveryQuery(name: string, query: string) {
  return requestJson<any>('/api/v1/outbound/save-query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, query }),
  });
}

export async function getSavedQueries() {
  return requestJson<any>('/api/v1/outbound/saved-queries');
}

