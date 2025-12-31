export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  // Merge headers
  options.headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };

  try {
    const res = await fetch(`${API_URL}/${endpoint}`, options);

    // Try to parse JSON safely
    let data: any = {};
    try {
      data = await res.json();
    } catch (err) {
      console.error('Failed to parse JSON from backend', err);
    }

    if (!res.ok) {
      throw new Error(data?.message || `API request failed with status ${res.status}`);
    }

    return data?.data || data; // handle both wrapped and unwrapped responses
  } catch (err: any) {
    console.error('API Fetch Error:', err.message);
    throw err;
  }
}
