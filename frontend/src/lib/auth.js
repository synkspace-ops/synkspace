import { apiGet } from './api';

export function getStoredToken() {
  return localStorage.getItem('token') || '';
}

export function clearAuthSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
}

export async function requireAuthenticatedUser() {
  const token = getStoredToken();
  if (!token) return null;
  try {
    const response = await apiGet('/api/auth/me');
    return response?.data?.user || null;
  } catch {
    clearAuthSession();
    return null;
  }
}
