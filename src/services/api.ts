import { ECOSYSTEM_URLS, DEFAULT_CONFIG } from '../constants';
import { UserDataLogResponse, ServiceHealth } from '../types';

const isLocal =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// In local dev without explicit VITE_BACKEND_URL, use Vite proxy (''); in production on custom domain, use ECOSYSTEM_URLS.LOGGER_API
export const API_BASE =
  isLocal && !import.meta.env.VITE_BACKEND_URL
    ? ''
    : (DEFAULT_CONFIG.BACKEND_API_URL || ECOSYSTEM_URLS.LOGGER_API).replace(/\/$/, '');

export const API_KEY = DEFAULT_CONFIG.API_KEY;

export function getAuthHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = { ...extraHeaders };
  if (API_KEY) {
    headers['x-logging-key'] = API_KEY;
  }
  return headers;
}

/**
 * Pings the central logging backend health endpoint
 */
export async function checkBackendHealth(): Promise<ServiceHealth> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/health`);
    if (!res.ok) {
      return { service: 'central-logging-service', status: 'degraded' };
    }
    const data = await res.json();
    return {
      service: data.data?.service || 'central-logging-service',
      status: 'healthy',
      uptime: data.data?.uptime,
      timestamp: data.data?.timestamp,
    };
  } catch (err) {
    return { service: 'central-logging-service', status: 'offline' };
  }
}

/**
 * Queries user data logs by Message ID
 */
export async function searchByMessageId(messageId: string): Promise<UserDataLogResponse> {
  const cleanId = messageId.trim();
  if (!cleanId) {
    throw new Error('Please enter a Message ID to search.');
  }

  const encodedId = encodeURIComponent(cleanId);
  const res = await fetch(`${API_BASE}/api/v1/logs/user-data/${encodedId}`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();

  if (!res.ok) {
    const message = data?.error?.message || data?.message || `Error ${res.status}: Failed to retrieve logs`;
    const error = new Error(message);
    (error as any).status = res.status;
    (error as any).details = data;
    throw error;
  }

  return data as UserDataLogResponse;
}

/**
 * Fetches recent user-data logs for the live activity feed
 */
export async function fetchRecentLogs(limit = 15): Promise<any> {
  const res = await fetch(`${API_BASE}/api/v1/logs/user-data?limit=${limit}`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message || 'Failed to fetch recent logs');
  }
  return data?.data?.records || [];
}

