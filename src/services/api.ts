import { UserDataLogResponse, ServiceHealth } from '../types';

/**
 * Pings the central logging backend health endpoint
 */
export async function checkBackendHealth(): Promise<ServiceHealth> {
  try {
    const res = await fetch('/api/v1/health');
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
 * Queries user data logs by Message ID via secure Vite proxy
 */
export async function searchByMessageId(messageId: string): Promise<UserDataLogResponse> {
  const cleanId = messageId.trim();
  if (!cleanId) {
    throw new Error('Please enter a Message ID to search.');
  }

  const encodedId = encodeURIComponent(cleanId);
  const res = await fetch(`/api/v1/logs/user-data/${encodedId}`);
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
  const res = await fetch(`/api/v1/logs/user-data?limit=${limit}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message || 'Failed to fetch recent logs');
  }
  return data?.data?.records || [];
}
