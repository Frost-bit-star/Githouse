import { apiFetch } from './api/client';

// Login user with email & password
export async function loginUser(email: string, password: string) {
  const data = await apiFetch('auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  localStorage.setItem('token', data.token); // store token for future requests
  return data.user; // return user object
}

// Register a new user
export async function registerUser(username: string, email: string, password: string, confirmPassword: string) {
  const data = await apiFetch('auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password, confirmPassword }),
  });

  localStorage.setItem('token', data.token); // store token
  return data.user; // return user object
}

// Get current logged-in user
export async function getCurrentUser() {
  return apiFetch('auth/me'); // token auto-attached
}

// Logout user
export function logout() {
  localStorage.removeItem('token');
}
