import { apiFetch } from './client';

export async function loginUser(username: string, password: string) {
  const data = await apiFetch('auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  localStorage.setItem('token', data.token);
  return data.user;
}

export async function registerUser(username: string, email: string, password: string) {
  const data = await apiFetch('auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });
  localStorage.setItem('token', data.token);
  return data.user;
}

export async function getCurrentUser() {
  return apiFetch('auth/me');
}

export function logout() {
  localStorage.removeItem('token');
}
