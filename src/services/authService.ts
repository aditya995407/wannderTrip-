/**
 * Authentication Service
 * Handles communication with the backend authentication endpoints and Google Identity Services.
 */

import { AuthUser, BackendAuthResponse } from '../types/auth';

const STORAGE_KEY_USER = 'wanderkanban_auth_user';
const STORAGE_KEY_TOKEN = 'wanderkanban_auth_token';
const STORAGE_KEY_BACKEND_URL = 'wanderkanban_backend_url';
const STORAGE_KEY_GOOGLE_CLIENT_ID = 'wanderkanban_google_client_id';

export const DEFAULT_BACKEND_URL = 'http://localhost:4000/api/auth/google';
export const DEFAULT_GOOGLE_CLIENT_ID =
  (import.meta.env.VITE_GOOGLE_CLIENT_ID as string) ||
  '967712469632-devsample.apps.googleusercontent.com';

// --- Session Persistence ---

export function getStoredAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getStoredAuthToken(): string | null {
  return localStorage.getItem(STORAGE_KEY_TOKEN);
}

export function saveAuthSession(user: AuthUser, token: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEY_TOKEN, token);
  } catch (err) {
    console.error('Failed to save auth session:', err);
  }
}

export function clearAuthSession(): void {
  localStorage.removeItem(STORAGE_KEY_USER);
  localStorage.removeItem(STORAGE_KEY_TOKEN);
}

// --- Configuration ---

export function getBackendApiUrl(): string {
  const saved = localStorage.getItem(STORAGE_KEY_BACKEND_URL);
  if (saved && saved.trim()) return saved.trim();
  return (import.meta.env.VITE_BACKEND_URL as string) || DEFAULT_BACKEND_URL;
}

export function setBackendApiUrl(url: string): void {
  if (!url || !url.trim()) {
    localStorage.removeItem(STORAGE_KEY_BACKEND_URL);
  } else {
    localStorage.setItem(STORAGE_KEY_BACKEND_URL, url.trim());
  }
}

export function getGoogleClientId(): string {
  const saved = localStorage.getItem(STORAGE_KEY_GOOGLE_CLIENT_ID);
  if (saved && saved.trim()) return saved.trim();
  return DEFAULT_GOOGLE_CLIENT_ID;
}

export function setGoogleClientId(id: string): void {
  if (!id || !id.trim()) {
    localStorage.removeItem(STORAGE_KEY_GOOGLE_CLIENT_ID);
  } else {
    localStorage.setItem(STORAGE_KEY_GOOGLE_CLIENT_ID, id.trim());
  }
}

// --- API Request ---

/**
 * Authenticates with user's backend server using Google credential (ID Token):
 * POST http://localhost:4000/api/auth/google
 * Body: { "credential": "<token_id>" }
 */
export async function authenticateWithGoogleCredential(
  credential: string,
  targetUrl?: string
): Promise<{ user: AuthUser; token: string }> {
  const url = targetUrl || getBackendApiUrl();

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ credential }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let msg = `Backend responded with HTTP ${response.status}: ${response.statusText}`;
    try {
      const parsed = JSON.parse(errorBody);
      if (parsed.message) msg = parsed.message;
      else if (parsed.error) msg = parsed.error;
    } catch {
      if (errorBody) msg += ` - ${errorBody}`;
    }
    throw new Error(msg);
  }

  const data: BackendAuthResponse = await response.json();

  if (!data || data.success === false) {
    throw new Error(data?.message || 'Authentication failed on backend server.');
  }

  if (!data.token) {
    throw new Error('Backend response did not return a session token.');
  }

  let extractedUser: AuthUser | null = null;

  if (data.user) {
    const userObj = data.user as any;
    if (Array.isArray(userObj.rows) && userObj.rows.length > 0) {
      const row = userObj.rows[0];
      extractedUser = {
        id: String(row.id || '1'),
        google_id: String(row.google_id || ''),
        name: String(row.name || 'Traveler'),
        email: String(row.email || ''),
        picture: String(
          row.picture ||
            'https://lh3.googleusercontent.com/a/default-user=s96-c'
        ),
      };
    } else if (userObj.id || userObj.email) {
      extractedUser = {
        id: String(userObj.id || '1'),
        google_id: String(userObj.google_id || ''),
        name: String(userObj.name || 'Traveler'),
        email: String(userObj.email || ''),
        picture: String(
          userObj.picture ||
            'https://lh3.googleusercontent.com/a/default-user=s96-c'
        ),
      };
    }
  }

  if (!extractedUser) {
    throw new Error('User record could not be parsed from backend response.');
  }

  saveAuthSession(extractedUser, data.token);

  return {
    user: extractedUser,
    token: data.token,
  };
}
