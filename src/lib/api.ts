import { urlconstant } from '@/app/constants';

/**
 * Client API centralisé avec gestion du token JWT
 */

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

/**
 * Requête GET authentifiée
 */
export async function apiGet<T = any>(endpoint: string): Promise<T> {
  const response = await fetch(`${urlconstant}${endpoint}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (response.status === 401) {
    handleUnauthorized();
    throw new Error('Session expirée');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erreur serveur' }));
    throw new Error(error.message || error.error || 'Erreur serveur');
  }

  return response.json();
}

/**
 * Requête POST authentifiée
 */
export async function apiPost<T = any>(endpoint: string, body?: any): Promise<T> {
  const response = await fetch(`${urlconstant}${endpoint}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401) {
    handleUnauthorized();
    throw new Error('Session expirée');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erreur serveur' }));
    throw new Error(error.message || error.error || 'Erreur serveur');
  }

  return response.json();
}

/**
 * Upload de fichier authentifié
 */
export async function apiUpload<T = any>(endpoint: string, formData: FormData): Promise<T> {
  const headers: Record<string, string> = {};

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${urlconstant}${endpoint}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (response.status === 401) {
    handleUnauthorized();
    throw new Error('Session expirée');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erreur serveur' }));
    throw new Error(error.message || error.error || 'Erreur serveur');
  }

  return response.json();
}

/**
 * Gestion de la déconnexion automatique si token expiré
 */
function handleUnauthorized() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenEnCours');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    // Rediriger vers la page de login
    window.location.href = '/payspanel/login';
  }
}

/**
 * Vérifie si l'utilisateur est connecté
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('isLoggedIn') === 'true' && !!localStorage.getItem('authToken');
}

/**
 * Déconnecte l'utilisateur
 */
export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenEnCours');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    window.location.href = '/payspanel/login';
  }
}
