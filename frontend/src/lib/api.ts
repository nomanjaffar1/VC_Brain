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
  return requestJson<{ latency_ms: number; trust_score: number; validation_score: number; hallucination_rate: number }>('/api/v1/evaluation/metrics');
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
