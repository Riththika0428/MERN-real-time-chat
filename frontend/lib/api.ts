const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export { API_URL };

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface FetchOptions extends RequestInit {
  token?: string | null;
}

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new ApiError(body?.message || 'Something went wrong', res.status);
  }

  return body as T;
}

// Separate from apiFetch because multipart/form-data requests must NOT set
// a Content-Type header manually — the browser sets it (with the correct
// boundary) only when it sees a FormData body and no Content-Type is present.
export async function apiUpload<T>(path: string, formData: FormData, token: string | null): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new ApiError(body?.message || 'Upload failed', res.status);
  }

  return body as T;
}